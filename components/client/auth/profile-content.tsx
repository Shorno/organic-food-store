import { checkAuth } from "@/app/actions/auth/checkAuth"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default async function ProfileContent() {
    const session = await checkAuth()

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <p className="text-muted-foreground">Please log in to view your profile.</p>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </div>
        )
    }

    const [firstName, ...lastNameParts] = (session.user.name || "").split(" ")
    const lastName = lastNameParts.join(" ")

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">My Profile</h2>
                <p className="text-muted-foreground">View your account information</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>User ID</Label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">{session.user.id}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>First Name</Label>
                        <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">{firstName || "—"}</div>
                    </div>
                    <div className="space-y-2">
                        <Label>Last Name</Label>
                        <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">{lastName || "—"}</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm text-foreground">{session.user.email}</div>
                </div>
            </div>
        </div>
    )
}
