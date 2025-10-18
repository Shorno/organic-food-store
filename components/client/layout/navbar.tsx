"use client"

import Link from "next/link"
import {ChevronRight, Menu, ShoppingCart} from "lucide-react"
import {ComponentPropsWithoutRef, useState} from "react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Button} from "@/components/ui/button"
import {usePathname} from "next/navigation"
import {cn} from "@/lib/utils"
import UserButton from "@/components/client/auth/user-button";

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
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/"
        }
        return pathname.startsWith(href)
    }

    const mobileNavLinks = navigationLinks.filter(link => link.href !== "/")

    return (
        <header className="border-b shadow-sm">
            <div className="container mx-auto px-4 lg:px-0">
                <div className="flex items-center justify-between py-2 lg:py-4">
                    {/* Mobile Navigation - Hidden on lg and above */}
                    <div className="flex items-center justify-between w-full lg:hidden">
                        {/* Mobile Menu Button - Left */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                    <Menu className="h-5 w-5"/>
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-full">
                                <SheetHeader>
                                    <SheetTitle className="text-center">
                                        <Link href="/">
                                            <span className="text-xl font-bold text-green-600">OrganicShop</span>
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2">
                                    {mobileNavLinks.map((navItem) => {
                                        const active = isActive(navItem.href!)

                                        return (
                                            <div key={navItem.name}>
                                                {navItem.type === "link" ? (
                                                    <Link
                                                        href={navItem.href!}
                                                        onClick={() => setOpen(false)}
                                                        className={cn(
                                                            "flex items-center justify-between px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                                            active && "bg-accent text-accent-foreground"
                                                        )}
                                                    >
                                                        <span>{navItem.name}</span>
                                                        <ChevronRight className="h-4 w-4"/>
                                                    </Link>
                                                ) : (
                                                    <div>
                                                        <div
                                                            className="flex items-center justify-between px-4 py-3 text-base font-semibold text-foreground">
                                                            <span>{navItem.name}</span>
                                                            <ChevronRight className="h-4 w-4"/>
                                                        </div>
                                                        <div className="ml-2 mt-1 flex flex-col gap-1">
                                                            {navItem.items?.map((category) => (
                                                                <Link
                                                                    key={category.title}
                                                                    href={category.href}
                                                                    onClick={() => setOpen(false)}
                                                                    className={cn(
                                                                        "flex items-center justify-between px-4 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                                                        pathname === category.href && "bg-accent/50 text-accent-foreground"
                                                                    )}
                                                                >
                                                                    <span>{category.title}</span>
                                                                    <ChevronRight className="h-3 w-3"/>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Logo - Center */}
                        <div className="flex-1 flex justify-center">
                            <Link href="/" className="flex items-center">
                                <span className="text-xl font-bold text-green-600">OrganicShop</span>
                            </Link>
                        </div>

                        {/* Cart Icon - Right */}
                        <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
                            <Link href="/cart" aria-label="Shopping Cart">
                                <ShoppingCart className="h-5 w-5"/>
                            </Link>
                        </Button>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile, visible on lg and above */}
                    <div className="hidden lg:flex lg:items-center lg:justify-between lg:w-full">
                        {/* Logo - Left */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <span className="text-2xl font-bold text-green-600">OrganicShop</span>
                            </Link>
                        </div>

                        {/* Navigation - Center */}
                        <NavigationMenu className="flex-1 flex justify-center">
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
                                    <ShoppingCart className="h-5 w-5"/>
                                </Link>
                            </Button>

                           <UserButton/>
                        </div>
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
