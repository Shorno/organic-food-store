import { Suspense } from "react";
import {AccountContent} from "@/components/client/auth/account-content";
import {AccountSkeleton} from "@/components/client/auth/account-skeleton";


export default function AccountPage() {
    // missign account page
    return (
        <Suspense fallback={<AccountSkeleton />}>
            <AccountContent />
        </Suspense>
    );
}
