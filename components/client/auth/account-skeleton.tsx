import { Skeleton } from "@/components/ui/skeleton";

export function AccountSkeleton() {
    return (
        <div className="flex justify-center items-center min-h-[90vh]">
            <div className="space-y-4">
                <Skeleton className="h-8 w-64 mb-4" /> {/* Title */}
                <Skeleton className="h-5 w-80" /> {/* User ID */}
                <Skeleton className="h-5 w-80" /> {/* Email */}
                <Skeleton className="h-5 w-80" /> {/* Name */}
            </div>
        </div>
    );
}
