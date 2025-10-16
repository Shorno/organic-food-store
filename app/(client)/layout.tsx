import Navbar from "@/components/client/layout/navbar";

export default function ClientLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar/>
            <div className={"container mx-auto px-4 md:px-0"}>
                {children}
            </div>
        </>
    )
}