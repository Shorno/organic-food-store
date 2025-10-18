"use client"
import {authClient} from "@/lib/auth-client";
import {Button} from "@/components/ui/button";

export default function LoginPage() {
    const handleLogin = async () => {
        await authClient.signIn.social({
            provider: "github",
        })
    }
    return (
        <div className={"flex justify-center items-center min-h-[90vh]"}>
            <Button onClick={handleLogin}>
                Login with GitHub
            </Button>
        </div>
    )
}
