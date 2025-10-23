
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
import getCategoryWithSubcategory from "@/app/(client)/actions/get-category-with-subcategory";

export default async function CategoryNav() {
    const categories = await getCategoryWithSubcategory()

    return (
        <div className="hidden lg:block border-b bg-muted/30">
            <div className="container mx-auto">
                <div className="flex items-center gap-2">
                    <Link href="/categories">
                        <Button variant="default" className="h-12 gap-2 rounded-none">
                            <LayoutGrid className="h-4 w-4" />
                            All Categories
                        </Button>
                    </Link>

                    <NavigationMenu className="max-w-none justify-start">
                        <NavigationMenuList className="gap-1">
                            {categories.map((category) => {
                                const hasSubcategories = category.subCategory && category.subCategory.length > 0

                                // If no subcategories, render as a simple link
                                if (!hasSubcategories) {
                                    return (
                                        <NavigationMenuItem key={category.name}>
                                            <Link href={`/${category.slug}`}>
                                                <Button variant="ghost" className="h-12 gap-2">
                                                    <div className="relative h-5 w-5 rounded-full overflow-hidden">
                                                        <Image
                                                            src={category.image}
                                                            alt={category.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    {category.name}
                                                </Button>
                                            </Link>
                                        </NavigationMenuItem>
                                    )
                                }

                                return (
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
                                            <ul className="grid w-[500px] gap-3 p-2 md:w-[600px] md:grid-cols-2">
                                                {category.subCategory.map((sub) => (
                                                    <li key={sub.name}>
                                                        <NavigationMenuLink asChild>
                                                            <Link
                                                                href={`/${category.slug}/${sub.slug}`}
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
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </div>
    )
}
