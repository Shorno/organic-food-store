import { Suspense } from "react"
import ProfileContent from "@/components/client/auth/profile-content";
import ProfileSkeleton from "@/components/client/auth/profile-skeleton";

export default function ProfilePage() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent />
            </Suspense>
        </div>
    )
}

