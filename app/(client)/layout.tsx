import Navbar from "@/components/client/layout/navbar";
import CategoryNav from "@/components/client/layout/category-nav";

export default function ClientLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar/>
            <CategoryNav/>
            <div>
                {children}
            </div>
            {/*<div className={"container mx-auto px-4 md:px-0"}>*/}
            {/*    {children}*/}
            {/*</div>*/}
        </>
    )
}