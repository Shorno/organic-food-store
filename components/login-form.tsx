"use client"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {authClient} from "@/lib/auth-client";
import Image from "next/image";

export function LoginForm() {

    const handleGithubLogin = async () => {
        await authClient.signIn.social({
            provider: "github",
        })
    }

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
        })
    }

    return (
        <div className={"flex flex-col gap-6"}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-muted-foreground text-balance">
                                    Login to your KhaatiBazar account
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled
                                />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-2 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input id="password" type="password" required disabled/>
                            </Field>
                            <Field>
                                <Button type="submit" disabled>Login</Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                Or continue with
                            </FieldSeparator>
                            <Field className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" onClick={handleGoogleLogin}>
                                    <Image src={"/logos/google.svg"}
                                           alt="GitHub Logo"
                                           className="h-5 w-5"
                                           width={20}
                                           height={20}
                                    />
                                    <span className="sr-only">Login with Google</span>
                                </Button>
                                <Button variant="outline" type="button" onClick={handleGithubLogin}>
                                    <Image src={"/logos/github.svg"}
                                           alt="GitHub Logo"
                                           className="h-5 w-5"
                                           width={20}
                                           height={20}
                                    />
                                    <span className="sr-only">Login with GitHub</span>
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <a href="#">Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-muted relative hidden md:block">
                        <Image
                            src="/images/login.webp"
                            alt="Image"
                            fill
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
