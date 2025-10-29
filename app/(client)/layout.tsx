import Navbar from "@/components/client/layout/navbar";
import CategoryNav from "@/components/client/layout/category-nav";
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory";
import CartSync from "@/components/client/cart/cart-sync";

export default async function ClientLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    const categories = await getCategoryWithSubcategory()

    return (
        <>
            <CartSync />
            <Navbar categories={categories}/>
            <CategoryNav categories={categories}/>
            <div>
                {children}
            </div>
            {/*<div className={"container mx-auto px-4 md:px-0"}>*/}
            {/*    {children}*/}
            {/*</div>*/}
        </>
    )
}