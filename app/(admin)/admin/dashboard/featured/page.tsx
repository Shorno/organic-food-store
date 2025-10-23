import NewFeaturedImageDialog from "@/app/(admin)/admin/dashboard/featured/_components/new-feature-dialog";
import FeaturedImagesCardList from "@/app/(admin)/admin/dashboard/featured/_components/featured-images-card-list";


export default function FeaturedImagesPage() {
    return (
        <div className="container mx-auto p-6">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Featured Images</h1>
                <NewFeaturedImageDialog />
            </header>
            <main>
                <FeaturedImagesCardList/>
            </main>
        </div>
    );
}
