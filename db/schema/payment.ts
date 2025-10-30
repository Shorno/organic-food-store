import {decimal, integer, pgEnum, pgTable, serial, timestamp, varchar} from "drizzle-orm/pg-core";
import { order } from "./order";
import {timestamps} from "@/db/schema/columns.helpers";

export const paymentMethodEnum = pgEnum("payment_method", [
    "bkash",
    "nagad",
    "rocket",
    "cod",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "processing",
    "completed",
    "failed",
    "refunded",
    "partially_refunded",
    "cancelled"
]);

export const payment = pgTable("payment", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
        .notNull()
        .references(() => order.id, { onDelete: "restrict" }),

    // transactionId: varchar("transaction_id", { length: 255 }).unique(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentProvider: varchar("payment_provider", { length: 50 }),

    status: paymentStatusEnum("status").default("pending").notNull(),

    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("BDT").notNull(),



    // Mobile Banking Details (for bKash, Nagad, Rocket)
    // senderNumber: varchar("sender_number", { length: 20 }),
    // receiverNumber: varchar("receiver_number", { length: 20 }),

    // Provider Response
    // providerResponse: jsonb("provider_response"),
    // errorMessage: text("error_message"),

    // Timestamps
    completedAt: timestamp("completed_at"),
    failedAt: timestamp("failed_at"),
    ...timestamps
});
