import NewFeaturedImageDialog from "@/app/(admin)/admin/dashboard/featured/_components/new-feature-dialog";
import FeaturedImagesCardList from "@/app/(admin)/admin/dashboard/featured/_components/featured-images-card-list";
import {getTranslations} from 'next-intl/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from "@/utils/get-query-client";
import getFeaturedImages from "@/app/(admin)/admin/dashboard/featured/action/get-featured-images";


export default async function FeaturedImagesPage() {
    const t = await getTranslations('featured');
    const queryClient = getQueryClient();

    // Prefetch featured images data on the server (don't await - non-blocking)
    queryClient.prefetchQuery({
        queryKey: ['admin-featured-images'],
        queryFn: getFeaturedImages,
    });

    return (
        <div className="container mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <NewFeaturedImageDialog />
            </header>
            <main>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <FeaturedImagesCardList/>
                </HydrationBoundary>
            </main>
        </div>
    );
}
