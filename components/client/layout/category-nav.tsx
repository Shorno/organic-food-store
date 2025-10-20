"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

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

export default function CategoryNav() {
    return (
        // Hidden on mobile, visible on md and up
        <div className="hidden lg:block border-b bg-muted/30">
            <div className="container mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/categories">
                        <Button
                            variant="default"
                            className="h-12 gap-2 rounded-none"
                        >
                            <LayoutGrid className="h-4 w-4" />
                            All Categories
                        </Button>
                    </Link>

                    <NavigationMenu className="max-w-none justify-start">
                        <NavigationMenuList className="gap-1">
                            {categories.map((category) => (
                                <NavigationMenuItem key={category.name}>
                                    <NavigationMenuTrigger className="h-12 gap-2">
                                        <div className="relative h-5 w-5 rounded-full overflow-hidden">
                                            <Image
                                                src={category.image}
                                                alt={category.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        {category.name}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                                            {category.subcategories.map((sub) => (
                                                <li key={sub.name}>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            href={sub.href}
                                                            className={cn(
                                                                "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                                                                    <Image
                                                                        src={sub.image}
                                                                        alt={sub.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div className="text-sm font-medium leading-none">
                                                                    {sub.name}
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </div>
    )
}
