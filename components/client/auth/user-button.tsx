import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function UserButton() {
    const { data, isPending } = authClient.useSession();

    if (isPending) {
        return <Skeleton className="size-7 rounded-full" />;
    }

    return (
        <Avatar className="size-7 cursor-pointer" asChild>
            <Link href="/profile" aria-label="User Profile">
                {data?.user ? (
                    <>
                        <AvatarImage src={data.user.image || ""} />
                        <AvatarFallback>{data.user.name?.[0]}</AvatarFallback>
                    </>
                ) : (
                    <AvatarFallback>
                        <User className="h-4 w-4" />
                    </AvatarFallback>
                )}
            </Link>
        </Avatar>
    );
}
