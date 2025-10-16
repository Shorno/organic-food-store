"use client"

import Link from "next/link"
import { ShoppingCart, User } from "lucide-react"
import { ComponentPropsWithoutRef } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const productCategories: { title: string; href: string; description: string }[] = [
    {
        title: "Fresh Vegetables",
        href: "/products/vegetables",
        description: "Farm-fresh organic vegetables delivered to your door",
    },
    {
        title: "Fresh Fruits",
        href: "/products/fruits",
        description: "Seasonal organic fruits, naturally ripened and pesticide-free",
    },
    {
        title: "Dairy & Eggs",
        href: "/products/dairy",
        description: "Organic milk, cheese, yogurt, and free-range eggs",
    },
    {
        title: "Grains & Pulses",
        href: "/products/grains",
        description: "Whole grains, rice, lentils, and organic flour",
    },
    {
        title: "Oils & Ghee",
        href: "/products/oils",
        description: "Cold-pressed oils, organic ghee, and cooking essentials",
    },
    {
        title: "Herbs & Spices",
        href: "/products/spices",
        description: "Fresh herbs and aromatic organic spices",
    },
]

const navigationLinks = [
    {
        name: "Home",
        href: "/",
        type: "link" as const,
    },
    {
        name: "Products",
        href: "/products",
        type: "dropdown" as const,
        items: productCategories,
    },
    {
        name: "About Us",
        href: "/about-us",
        type: "link" as const,
    },
    {
        name: "Contact",
        href: "/contact",
        type: "link" as const,
    },
]

export default function Navbar() {
    const isMobile = useIsMobile()
    const pathname = usePathname()

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/"
        }
        return pathname.startsWith(href)
    }

    return (
        <header className="border-b shadow-sm">
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-4">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-2xl font-bold text-green-600">OrganicShop</span>
                        </Link>
                    </div>

                    {/* Navigation - Center */}
                    <NavigationMenu viewport={isMobile} className="flex-1 flex justify-center">
                        <NavigationMenuList className="flex-wrap">
                            {navigationLinks.map((navItem) => {
                                const active = isActive(navItem.href!)

                                return (
                                    <NavigationMenuItem key={navItem.name}>
                                        {navItem.type === "link" ? (
                                            <NavigationMenuLink
                                                asChild
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    active && "bg-accent text-accent-foreground underline"
                                                )}
                                            >
                                                <Link href={navItem.href!}>
                                                    {navItem.name}
                                                </Link>
                                            </NavigationMenuLink>
                                        ) : (
                                            <>
                                                <NavigationMenuTrigger
                                                    className={cn(
                                                        active && "bg-accent text-accent-foreground"
                                                    )}
                                                >
                                                    {navItem.name}
                                                </NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid gap-2 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                                        {navItem.items?.map((category) => (
                                                            <ListItem
                                                                key={category.title}
                                                                title={category.title}
                                                                href={category.href}
                                                                isActive={pathname === category.href}
                                                            >
                                                                {category.description}
                                                            </ListItem>
                                                        ))}
                                                    </ul>
                                                </NavigationMenuContent>
                                            </>
                                        )}
                                    </NavigationMenuItem>
                                )
                            })}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Action Icons - Right */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/cart" aria-label="Shopping Cart">
                                <ShoppingCart className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/profile" aria-label="User Profile">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}

function ListItem({
                      title,
                      children,
                      href,
                      isActive,
                      ...props
                  }: ComponentPropsWithoutRef<"li"> & { href: string; isActive?: boolean }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive && "bg-accent/50 text-accent-foreground"
                    )}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
