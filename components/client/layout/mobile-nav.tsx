"use client"

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

const categories = [
    {
        name: "Honey",
        image: "/images/categories/honey.jpg",
        subcategories: [
            { name: "Raw Honey", href: "/categories/honey/raw-honey", image: "/images/subcategories/raw-honey.jpg" },
            { name: "Manuka Honey", href: "/categories/honey/manuka", image: "/images/subcategories/manuka.jpg" },
            { name: "Wildflower Honey", href: "/categories/honey/wildflower", image: "/images/subcategories/wildflower.jpg" },
            { name: "Acacia Honey", href: "/categories/honey/acacia", image: "/images/subcategories/acacia.jpg" },
        ]
    },
    {
        name: "Nuts & Seeds",
        image: "/images/categories/nuts.jpg",
        subcategories: [
            { name: "Almonds", href: "/categories/nuts/almonds", image: "/images/subcategories/almonds.jpg" },
            { name: "Walnuts", href: "/categories/nuts/walnuts", image: "/images/subcategories/walnuts.jpg" },
            { name: "Cashews", href: "/categories/nuts/cashews", image: "/images/subcategories/cashews.jpg" },
            { name: "Chia Seeds", href: "/categories/nuts/chia-seeds", image: "/images/subcategories/chia.jpg" },
        ]
    },
    {
        name: "Oils",
        image: "/images/categories/oils.jpg",
        subcategories: [
            { name: "Olive Oil", href: "/categories/oils/olive", image: "/images/subcategories/olive-oil.jpg" },
            { name: "Coconut Oil", href: "/categories/oils/coconut", image: "/images/subcategories/coconut-oil.jpg" },
            { name: "Mustard Oil", href: "/categories/oils/mustard", image: "/images/subcategories/mustard-oil.jpg" },
            { name: "Sesame Oil", href: "/categories/oils/sesame", image: "/images/subcategories/sesame-oil.jpg" },
        ]
    },
    {
        name: "Spices",
        image: "/images/categories/spices.jpg",
        subcategories: [
            { name: "Turmeric", href: "/categories/spices/turmeric", image: "/images/subcategories/turmeric.jpg" },
            { name: "Cinnamon", href: "/categories/spices/cinnamon", image: "/images/subcategories/cinnamon.jpg" },
            { name: "Black Pepper", href: "/categories/spices/pepper", image: "/images/subcategories/pepper.jpg" },
            { name: "Cumin", href: "/categories/spices/cumin", image: "/images/subcategories/cumin.jpg" },
        ]
    },
    {
        name: "Grains & Rice",
        image: "/images/categories/grains.jpg",
        subcategories: [
            { name: "Basmati Rice", href: "/categories/grains/basmati", image: "/images/subcategories/basmati.jpg" },
            { name: "Quinoa", href: "/categories/grains/quinoa", image: "/images/subcategories/quinoa.jpg" },
            { name: "Oats", href: "/categories/grains/oats", image: "/images/subcategories/oats.jpg" },
            { name: "Brown Rice", href: "/categories/grains/brown-rice", image: "/images/subcategories/brown-rice.jpg" },
        ]
    },
]

export default function MobileNav() {
    return (
        <ScrollArea className="h-full py-6">
            <div className="px-4 pb-4">
                <Link href="/categories">
                    <Button className="w-full gap-2 mb-4" size="lg">
                        <LayoutGrid className="h-4 w-4" />
                        All Categories
                    </Button>
                </Link>

                <Accordion type="single" collapsible className="w-full">
                    {categories.map((category, idx) => (
                        <AccordionItem key={category.name} value={`item-${idx}`}>
                            <AccordionTrigger className="hover:no-underline">
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
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-1 pl-11">
                                    {category.subcategories.map((sub) => (
                                        <Link
                                            key={sub.name}
                                            href={sub.href}
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
                    ))}
                </Accordion>
            </div>
        </ScrollArea>
    )
}
