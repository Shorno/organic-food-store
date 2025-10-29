"use client"

import * as React from "react"
import { useForm } from "@tanstack/react-form"
import { CreditCard, Banknote } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {addressSchema, ShippingFormData} from "@/lib/schemas/address.scheam"


interface ShippingFormProps {
    onValidSubmit: (data: ShippingFormData) => void
}

export default function ShippingForm({ onValidSubmit }: ShippingFormProps) {
    const [paymentType, setPaymentType] = React.useState<"online" | "cod">("online")

    const form = useForm({
        defaultValues: {
            fullName: "",
            phone: "",
            addressLine: "",
            country: "BD",
        },
        validators: {
            onChange: addressSchema,
        },
        onSubmit: async ({ value }) => {
            onValidSubmit({
                ...value,
                paymentType
            })
        },
    })

    return (
        <Card className="rounded-sm">
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                    <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
                    <RadioGroup
                        value={paymentType}
                        onValueChange={(value: "online" | "cod") => setPaymentType(value)}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div>
                            <RadioGroupItem value="online" id="online" className="peer sr-only" />
                            <Label
                                htmlFor="online"
                                className="flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent transition-all"
                            >
                                <CreditCard className="h-5 w-5" />
                                <div className="flex-1">
                                    <span className="font-medium block">Online Payment</span>
                                    <span className="text-xs text-muted-foreground">SSLCommerz</span>
                                </div>
                            </Label>
                        </div>

                        <div>
                            <RadioGroupItem value="cod" id="cod" className="peer sr-only" />
                            <Label
                                htmlFor="cod"
                                className="flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent transition-all"
                            >
                                <Banknote className="h-5 w-5" />
                                <div className="flex-1">
                                    <span className="font-medium block">Cash on Delivery</span>
                                    <span className="text-xs text-muted-foreground">Pay on arrival</span>
                                </div>
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Form Fields */}
                <form
                    id="shipping-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="space-y-4"
                >
                    <FieldGroup>
                        {/* Full Name */}
                        <form.Field name="fullName">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Full name *
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Enter full name"
                                            autoComplete="name"
                                        />
                                        {isInvalid && (
                                            <FieldError  errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}

                        </form.Field>

                        {/* Phone Number */}
                        <form.Field name="phone">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Phone number *
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            type="tel"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="Enter phone number"
                                            autoComplete="tel"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>

                        {/* Address Line */}
                        <form.Field name="addressLine">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Address *
                                        </FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="House no., street name, area, city"
                                            autoComplete="street-address"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        </form.Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
