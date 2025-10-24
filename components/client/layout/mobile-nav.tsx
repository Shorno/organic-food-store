
import Link from "next/link"
import Image from "next/image"
import {LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {CategoryWithSubcategories} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";


interface MobileNavProps{
    categories : CategoryWithSubcategories[]
}


export default function MobileNav({categories}: MobileNavProps) {


    return (
        <ScrollArea className="h-full py-6">
            <div className="px-4 pb-4">
                <Link href="/categories">
                    <Button className="w-full gap-2 mb-4" size="lg">
                        <LayoutGrid className="h-4 w-4" />
                        All Categories
                    </Button>
                </Link>

                <div className="w-full">
                    {categories.map((category, idx) => {
                        const hasSubcategories = category.subCategory && category.subCategory.length > 0;

                        if (!hasSubcategories) {
                            return (
                                <Link
                                    key={category.name}
                                    href={`/${category.slug}`}
                                    className="flex items-center gap-3 py-2  mb-2 rounded-md hover:bg-accent transition-colors"
                                >
                                    <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-medium">{category.name}</span>
                                </Link>
                            );
                        }

                        return (
                            <Accordion type="single" collapsible className="w-full" key={category.name}>
                                <AccordionItem value={`item-${idx}`}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <Link href={`/${category.slug}`} onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        </Link>
                                    </AccordionTrigger>

                                    <AccordionContent>
                                        <div className="space-y-1 pl-11">
                                            {category.subCategory.map((sub) => (
                                                <Link
                                                    key={sub.name}
                                                    href={`/${category.slug}/${sub.slug}`}
                                                    className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-accent transition-colors"
                                                >
                                                    <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={sub.image}
                                                            alt={sub.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm">{sub.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        );
                    })}
                </div>
            </div>
        </ScrollArea>
    );
}
