import {checkAuth} from "@/app/actions/auth/checkAuth";
import Link from "next/link";

export async function AccountContent() {
    const session = await checkAuth();

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-[90vh]">
                <p>Please log in to view your account details.</p>
                <Link href="/login" className="ml-2 text-blue-500 underline">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div>
                <h1 className="text-2xl font-bold mb-4">Account Details</h1>
                <p><strong>User ID:</strong> {session.user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
            </div>
        </div>
    );
}
