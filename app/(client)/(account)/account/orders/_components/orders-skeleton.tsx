// app/(client)/(account)/account/orders/_components/orders-loading.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 sm:h-6 w-32 sm:w-40" />
                                <Skeleton className="h-3 sm:h-4 w-40 sm:w-48" />
                            </div>
                            <Skeleton className="h-6 w-20 self-start sm:self-auto" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Items Preview Skeleton */}
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map((j) => (
                                    <Skeleton key={j} className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-md" />
                                ))}
                            </div>

                            {/* Summary Skeleton */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 sm:h-4 w-24" />
                                    <Skeleton className="h-6 sm:h-7 w-28" />
                                </div>
                                <Skeleton className="h-10 w-full sm:w-32" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
