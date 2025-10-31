# Payment Flow Documentation

## Overview
This application implements a payment system using **SSLCommerz** payment gateway with support for both **online payment** and **Cash on Delivery (COD)**. The flow involves order creation, payment processing, verification, and confirmation.

---

## ⚠️ SOURCE OF TRUTH - WHERE DOES THE DATA COME FROM?

### **The Ultimate Source of Truth: Your PostgreSQL Database**

All payment and order completion information is stored and retrieved from **your database** via these tables:
- `order` table - Order status and details
- `payment` table - Payment status and transaction info
- `orderItem` table - Products in the order

### **How Data Gets INTO the Database (Write Operations)**

#### **For Cash on Delivery (COD):**
```
User submits checkout form
        ↓
createOrder() in order.ts
        ↓
Writes to database:
- order table (status: "pending")
- payment table (status: "pending", method: "cod")
- orderItem table
        ↓
DATABASE IS UPDATED ✓
```

**Source File:** `app/actions/order.ts` → `createOrder()`
**Database Tables Written:** order, payment, orderItem

---

#### **For Online Payment (SSLCommerz):**

There are **THREE separate paths** that can update your database:

##### **Path 1: IPN (Instant Payment Notification) - SERVER-TO-SERVER ⭐ MOST RELIABLE**
```
SSLCommerz Payment Gateway
        ↓ (Direct server call)
/api/payment/ipn
        ↓
Reads SSLCommerz POST data (status, tran_id, orderId)
        ↓
Updates database directly:
- order.status = "confirmed"
- payment.status = "completed"
- payment.paymentProvider = transaction_id
        ↓
DATABASE IS UPDATED ✓
```

**Source File:** `app/api/payment/ipn/route.ts`
**Trigger:** SSLCommerz calls your server directly (NOT through user's browser)
**Reliability:** ⭐⭐⭐⭐⭐ (Most reliable - happens independently of user)

**Key Code:**
```typescript
// IPN receives data directly from SSLCommerz
const status = body.get("status") // "VALID" or "VALIDATED"
const tranId = body.get("tran_id") // Transaction ID
const orderId = parseInt(body.get("value_a")) // Your order ID

// Then updates YOUR database
await db.update(order).set({ status: "confirmed" })
await db.update(payment).set({ status: "completed" })
```

---

##### **Path 2: User Verification Page - BROWSER-BASED WITH API VALIDATION ⭐⭐⭐**
```
User completes payment on SSLCommerz
        ↓
SSLCommerz redirects to /api/payment/success
        ↓
Success route redirects browser to /checkout/payment/success?val_id=X
        ↓
Success page calls verifyPayment(val_id)
        ↓
verifyPayment() calls SSLCommerz Validation API
        ↓
SSLCommerz responds with VALID/INVALID
        ↓
If VALID, updates database:
- order.status = "confirmed"
- payment.status = "completed"
        ↓
Reads order data from database
        ↓
Returns order to display to user
```

**Source Files:** 
- `app/api/payment/success/route.ts` (redirect only)
- `app/(client)/checkout/payment/success/page.tsx` (UI + calls verification)
- `app/actions/payment.ts` → `verifyPayment()` (validates with SSLCommerz + updates DB)

**Reliability:** ⭐⭐⭐ (Dependent on user's browser, but validates with SSLCommerz)

**Key Code:**
```typescript
// Success page extracts val_id from URL
const valId = searchParams.get("val_id")

// Calls server action
const result = await verifyPayment(valId)

// verifyPayment() in turn calls SSLCommerz API
const response = await fetch(
  `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${valId}&...`
)

// SSLCommerz responds with payment validation
const result = await response.json()
if (result.status === "VALID") {
  // NOW update YOUR database
  await db.update(order).set({ status: "confirmed" })
  await db.update(payment).set({ status: "completed" })
}
```

---

##### **Path 3: Success/Fail/Cancel Routes - REDIRECT ONLY (NO DATABASE UPDATE)**
```
SSLCommerz Payment Gateway
        ↓
Redirects user to /api/payment/success (or fail/cancel)
        ↓
API route extracts data and redirects browser
        ↓
NO DATABASE UPDATE - Just passes data to UI
```

**Source Files:**
- `app/api/payment/success/route.ts`
- `app/api/payment/fail/route.ts`
- `app/api/payment/cancel/route.ts`

**Purpose:** These routes DON'T update the database - they just redirect the user's browser with query parameters

---

### **How You GET Data FROM Database (Read Operations)**

#### **On Success Page:**
```typescript
// File: app/(client)/checkout/payment/success/page.tsx
const result = await verifyPayment(valId)
// ↓ verifyPayment updates DB, then reads from DB
const [orderData] = await db.select().from(order).where(eq(order.id, orderId))
// ↑ THIS is where you get the order data shown to user
```

#### **On Confirm Page (COD):**
```typescript
// File: app/(client)/checkout/confirm/page.tsx
const order = await getOrderById(id)
// ↓ getOrderById reads from database
const [orderData] = await db.query.order.findMany({
  where: (order, { eq }) => eq(order.id, orderId),
  with: { items: true } // Includes order items
})
```

#### **On User's Orders Page:**
```typescript
// File: app/actions/order.ts → getUserOrders()
return await db.query.order.findMany({
  where: (order, { eq }) => eq(order.userId, session.user.id),
  with: { items: true }
})
```

---

### **Visual Summary: Data Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                     SSLCommerz Gateway                       │
│                  (External Payment System)                   │
└────────────┬────────────────────────────────┬───────────────┘
             │                                 │
      IPN (Server)                      Redirect (Browser)
             │                                 │
             ↓                                 ↓
   ┌─────────────────┐              ┌──────────────────┐
   │ /api/payment/ipn│              │ /api/payment/    │
   │                 │              │ success/fail/    │
   │ UPDATES DB ✓    │              │ cancel           │
   └────────┬────────┘              │                  │
            │                       │ NO DB UPDATE     │
            ↓                       │ Just redirects   │
   ┌──────────────────────┐        └────────┬─────────┘
   │  YOUR DATABASE       │                 │
   │  ┌────────────────┐  │                 ↓
   │  │ order table    │  │        User's Browser
   │  │ payment table  │  │                 │
   │  │ orderItem table│  │                 ↓
   │  └────────────────┘  │        Success Page
   └──────────┬───────────┘                 │
              ↑                              │
              │                              ↓
              │                    verifyPayment(val_id)
              │                              │
              │                              ↓
              │                    Calls SSLCommerz API
              │                              │
              │                              ↓
              │                    Validates payment
              │                              │
              │                              ↓
              └──────────────────────────────┘
                     UPDATES DB ✓
                          │
                          ↓
                   Reads from DB
                          │
                          ↓
                 Shows order to user
```

---

### **Critical Understanding:**

1. **SSLCommerz is NOT your database** - It's an external payment gateway
2. **Your database is the source of truth** - All order/payment status lives in PostgreSQL
3. **Multiple update paths exist:**
   - **IPN** (most reliable) - Server-to-server, happens automatically
   - **verifyPayment()** (user-dependent) - Browser-based, validates with SSLCommerz then updates DB
4. **The success/fail/cancel API routes don't update the database** - They just redirect users
5. **When you display order info**, you're reading from **your database**, not from SSLCommerz

---

### **What Happens If IPN Fails?**

This is why there are TWO update paths:
- **Best case:** IPN updates the database immediately (user doesn't even need to complete redirect)
- **Fallback:** User's browser lands on success page, `verifyPayment()` validates with SSLCommerz and updates DB

Both paths check with SSLCommerz to ensure payment is legitimate before marking order as confirmed.

---

### **Where to Check Payment Status:**

```sql
-- Check order status
SELECT * FROM "order" WHERE id = <orderId>;

-- Check payment status
SELECT * FROM "payment" WHERE order_id = <orderId>;

-- Order status values: pending → confirmed → processing → shipped → delivered
-- Payment status values: pending → processing → completed
```

---

## Payment Flow Diagram

```
User adds items to cart
        ↓
User proceeds to checkout (/checkout)
        ↓
User fills shipping form & selects payment method
        ↓
    [Decision Point]
        ↓
   ┌────┴────┐
   ↓         ↓
  COD    Online Payment
   ↓         ↓
Direct   Payment Gateway
Confirm   (SSLCommerz)
   ↓         ↓
   └────┬────┘
        ↓
   Order Confirmed
```

---

## Step-by-Step Flow

### **Step 1: Checkout Page - Order Initialization**
**File:** `app/(client)/checkout/page.tsx`

**What it does:**
1. Displays shipping form and cart review
2. Collects user's shipping information and payment method choice
3. When user submits the form:
   - Calls `createOrder()` server action
   - Creates order record in database with status "pending"
   - Creates payment record with status "pending"
   - Reduces product stock quantities
4. Routes user based on payment method:
   - **COD**: Redirects to `/checkout/confirm?orderId=X`
   - **Online Payment**: Redirects to `/checkout/payment?orderId=X`

**Key Function:**
```typescript
handleValidSubmit(shippingData) {
  // Creates order
  const result = await createOrder(orderData)
  
  // Routes based on payment type
  if (shippingData.paymentType === "cod") {
    router.push(`/checkout/confirm?orderId=${result.orderId}`)
  } else {
    router.push(`/checkout/payment?orderId=${result.orderId}`)
  }
}
```

---

### **Step 2: Order Creation (Server Action)**
**File:** `app/actions/order.ts`

**Function:** `createOrder(data: CreateOrderData)`

**What it does:**
1. **Authentication Check**: Verifies user is logged in
2. **Cart Validation**: Ensures cart has items
3. **Price Calculation**: Calculates subtotal, shipping, and total
4. **Database Transaction**:
   - Validates product stock availability
   - Reduces stock quantities atomically
   - Creates order record with status "pending"
   - Creates order items (snapshot of products at purchase time)
   - Creates payment record with status "pending"
5. Returns `orderId` and `orderNumber`

**Database Schema Used:**
- **order** table (`db/schema/order.ts`)
- **orderItem** table (`db/schema/order.ts`)
- **payment** table (`db/schema/payment.ts`)

**Order Status Flow:**
- `pending` → `confirmed` → `processing` → `shipped` → `delivered`
- Alternative: `pending` → `cancelled`

---

### **Step 3A: Cash on Delivery Path**
**File:** `app/(client)/checkout/confirm/page.tsx`

**What it does:**
1. Receives `orderId` from query params
2. Fetches order details using `getOrderById()`
3. Displays order confirmation with:
   - Order number and date
   - Shipping information
   - Payment method (COD)
   - Order items
   - Total amount
4. Order remains in "pending" status until admin confirms it manually

**Note:** COD orders bypass the payment gateway entirely.

---

### **Step 3B: Online Payment Path**

#### **Step 3B.1: Payment Initiation Page**
**File:** `app/(client)/checkout/payment/page.tsx`

**What it does:**
1. Auto-initiates payment on page load
2. Calls `initiatePayment()` server action
3. Redirects user to SSLCommerz gateway URL
4. Shows loading state while processing

---

#### **Step 3B.2: Payment Initiation (Server Action)**
**File:** `app/actions/payment.ts`

**Function:** `initiatePayment(orderId: number)`

**What it does:**
1. **Validates User**: Checks if user is logged in
2. **Fetches Order**: Gets order details from database
3. **Validates Order Status**: Ensures order is "pending"
4. **Generates Transaction ID**: Creates unique transaction ID
5. **Prepares Payment Data**:
   - Store credentials (ID & password)
   - Amount and currency (BDT)
   - Customer information
   - Shipping information
   - Callback URLs (success, fail, cancel, IPN)
6. **Calls SSLCommerz API**: POSTs to payment gateway
7. **Updates Payment Record**: Sets status to "processing"
8. **Returns Gateway URL**: Frontend redirects user to this URL

**Configuration:**
```typescript
SSLCOMMERZ_CONFIG = {
  storeId: process.env.STORE_ID,
  storePassword: process.env.STORE_PASSWORD,
  isLive: false, // Sandbox mode
  successUrl: "/api/payment/success",
  failUrl: "/api/payment/fail",
  cancelUrl: "/api/payment/cancel",
  ipnUrl: "/api/payment/ipn"
}
```

**Callback URLs Explained:**
- **success**: Called when payment succeeds
- **fail**: Called when payment fails
- **cancel**: Called when user cancels payment
- **ipn**: Instant Payment Notification (server-to-server callback)

---

#### **Step 3B.3: User Completes Payment on SSLCommerz**
User is now on SSLCommerz website/page where they:
1. Select payment method (card, mobile banking, etc.)
2. Enter payment details
3. Complete the transaction

SSLCommerz then redirects back to your application via callback URLs.

---

#### **Step 3B.4: Payment Callbacks (API Routes)**

##### **Success Callback**
**File:** `app/api/payment/success/route.ts`

**What it does:**
1. Receives POST request from SSLCommerz with payment data
2. Extracts payment information:
   - `value_a`: orderId
   - `val_id`: Validation ID for verification
   - `tran_id`: Transaction ID
   - `amount`: Payment amount
   - `status`: Payment status
3. Redirects browser to success page with query params:
   - `/checkout/payment/success?value_a=X&val_id=Y&...`

---

##### **Fail Callback**
**File:** `app/api/payment/fail/route.ts`

**What it does:**
1. Receives POST when payment fails
2. Extracts error information
3. Redirects to: `/checkout/payment/failed?id=X&reason=Y`

---

##### **Cancel Callback**
**File:** `app/api/payment/cancel/route.ts`

**What it does:**
1. Receives POST when user cancels payment
2. Redirects to: `/checkout/payment/failed?status=CANCELLED`

---

##### **IPN (Instant Payment Notification)**
**File:** `app/api/payment/ipn/route.ts`

**What it does:**
1. **Server-to-server callback** from SSLCommerz
2. Runs independently of user's browser
3. Updates database based on payment status:
   - **If VALID/VALIDATED**:
     - Updates order status to "confirmed"
     - Updates payment status to "completed"
     - Records transaction ID
   - **If FAILED**:
     - Updates payment status to "failed"
4. Returns JSON response to SSLCommerz

**Note:** IPN is the most reliable callback as it's not dependent on user's browser.

---

#### **Step 3B.5: Payment Success Page**
**File:** `app/(client)/checkout/payment/success/page.tsx`

**What it does:**
1. Extracts `val_id` from URL query params
2. Calls `verifyPayment(val_id)` to validate with SSLCommerz
3. Shows loading state during verification
4. Displays success message with order details
5. Provides links to view order or continue shopping

---

#### **Step 3B.6: Payment Verification (Server Action)**
**File:** `app/actions/payment.ts`

**Function:** `verifyPayment(valId: string)`

**What it does:**
1. **Validates User Session**
2. **Calls SSLCommerz Validation API**:
   - Sends `val_id`, `store_id`, `store_passwd`
   - Validates the payment was actually successful
3. **If Payment is VALID**:
   - Updates order status to "confirmed"
   - Updates payment status to "completed"
   - Records transaction ID
   - Returns order data
4. **If Payment is INVALID**:
   - Returns error message

**Why This Step?**
This prevents fraud by verifying payment directly with SSLCommerz rather than trusting only the browser redirect.

---

#### **Step 3B.7: Payment Failed Page**
**File:** `app/(client)/checkout/payment/failed/page.tsx`

**What it does:**
1. Displays error message
2. Shows possible reasons for failure
3. Provides options:
   - Try payment again
   - View order
   - Return to home

---

## Database Schema

### **Order Table** (`db/schema/order.ts`)
```typescript
order {
  id: serial
  orderNumber: varchar (unique)
  userId: varchar
  status: orderStatusEnum // pending, confirmed, processing, shipped, delivered, cancelled
  subtotal: decimal
  shippingAmount: decimal
  totalAmount: decimal
  customerFullName: varchar
  customerEmail: varchar
  customerPhone: varchar
  shippingAddressLine: varchar
  shippingCity: varchar
  shippingArea: varchar
  shippingPostalCode: varchar
  shippingCountry: varchar
  confirmedAt: timestamp
  shippedAt: timestamp
  deliveredAt: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

### **Order Item Table** (`db/schema/order.ts`)
```typescript
orderItem {
  id: serial
  orderId: integer (FK to order)
  productId: integer (FK to product)
  productName: varchar // Snapshot at time of order
  productSize: varchar
  productImage: varchar
  quantity: integer
  unitPrice: decimal
  subtotal: decimal
  totalAmount: decimal
}
```

### **Payment Table** (`db/schema/payment.ts`)
```typescript
payment {
  id: serial
  orderId: integer (FK to order)
  paymentMethod: paymentMethodEnum // bkash, nagad, rocket, cod
  paymentProvider: varchar // Transaction ID from gateway
  status: paymentStatusEnum // pending, processing, completed, failed, refunded, cancelled
  amount: decimal
  currency: varchar (default: "BDT")
  completedAt: timestamp
  failedAt: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

---

## Payment Status Flow

```
Payment Created (pending)
        ↓
Payment Initiated (processing)
        ↓
   [Gateway Response]
        ↓
   ┌────┴────┐
   ↓         ↓
Success    Failure
   ↓         ↓
completed  failed
```

---

## Key Files Summary

| File Path | Purpose |
|-----------|---------|
| `app/(client)/checkout/page.tsx` | Main checkout page, collects shipping info |
| `app/(client)/checkout/payment/page.tsx` | Initiates online payment |
| `app/(client)/checkout/payment/success/page.tsx` | Payment success verification page |
| `app/(client)/checkout/payment/failed/page.tsx` | Payment failure handling |
| `app/(client)/checkout/confirm/page.tsx` | Order confirmation (COD path) |
| `app/actions/order.ts` | Order creation logic |
| `app/actions/payment.ts` | Payment initiation & verification |
| `app/api/payment/success/route.ts` | Success callback from SSLCommerz |
| `app/api/payment/fail/route.ts` | Failure callback from SSLCommerz |
| `app/api/payment/cancel/route.ts` | Cancel callback from SSLCommerz |
| `app/api/payment/ipn/route.ts` | Server-to-server payment notification |
| `db/schema/order.ts` | Order and order item schema |
| `db/schema/payment.ts` | Payment schema |

---

## Environment Variables Required

```env
STORE_ID=your_sslcommerz_store_id
STORE_PASSWORD=your_sslcommerz_store_password
BETTER_AUTH_URL=https://yourdomain.com (or http://localhost:3000 for dev)
```

---

## Important Notes

1. **Stock Management**: Stock is reduced immediately when order is created, regardless of payment status
2. **Transaction Atomicity**: Order creation uses database transactions to ensure data consistency
3. **Payment Verification**: Uses dual verification (IPN + manual validation) for security
4. **Order Snapshots**: Product details are copied to order items table to preserve historical data
5. **Sandbox Mode**: Currently configured for SSLCommerz sandbox (test environment)
6. **COD Orders**: Remain in "pending" status until manually confirmed by admin

---

## Testing in Development

### For COD:
1. Add items to cart
2. Go to checkout
3. Select "Cash on Delivery"
4. Complete order → Goes directly to confirmation

### For Online Payment (Sandbox):
1. Add items to cart
2. Go to checkout
3. Select online payment
4. Redirects to SSLCommerz sandbox
5. Use test card credentials from SSLCommerz
6. Complete payment
7. Verify on success page

**Note:** SSLCommerz sandbox may have issues redirecting to localhost. Check the IPN endpoint logs or orders page to verify payment status.

---

## Security Considerations

1. ✅ Server-side order validation
2. ✅ User authentication checks
3. ✅ Payment verification with SSLCommerz
4. ✅ Transaction IDs for tracking
5. ✅ Database transactions for atomicity
6. ✅ Stock validation before order creation
7. ✅ Order ownership validation (user can only see their orders)

---

## Future Enhancements

- [ ] Add refund functionality
- [ ] Implement partial refunds
- [ ] Add order tracking system
- [ ] Email notifications for order status
- [ ] Admin dashboard for order management
- [ ] Support for coupons/promo codes
- [ ] Order history export
- [ ] Payment retry mechanism for failed transactions
