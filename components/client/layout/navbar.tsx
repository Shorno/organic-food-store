"use client"
import Logo from "@/components/Logo";
import {Button} from "@/components/ui/button";
import {ShoppingCart, SearchIcon, Menu} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput} from "@/components/ui/input-group";
import UserButton from "@/components/client/profile/user-button";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import MobileNav from "@/components/client/layout/mobile-nav";
import {CategoryWithSubcategories} from "@/app/(admin)/admin/dashboard/category/_components/category/category-columns";
import Link from "next/link";

interface NavbarProps {
    categories: CategoryWithSubcategories[]
}

export default function Navbar({categories}: NavbarProps) {
    return (
        <nav className="border-b">
            <div
                className={"flex container mx-auto justify-start lg:justify-between items-center gap-2 sm:gap-4 h-14 lg:h-20 px-4 lg:p-0"}>
                {/* Mobile/Tablet Menu Button - Hidden on desktop (lg) */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="lg:hidden">
                            <Menu className="h-5 w-5"/>
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                        <SheetHeader>
                            <SheetTitle>
                                <Logo/>
                            </SheetTitle>
                        </SheetHeader>
                        <MobileNav categories={categories}/>
                    </SheetContent>
                </Sheet>

                {/* Logo */}
                <Link href={"/"} className="flex-shrink-0">
                    <Logo/>
                </Link>

                {/* Desktop Search - Hidden on mobile/tablet, visible on lg+ */}
                <InputGroup className={"hidden lg:flex flex-1 max-w-5xl h-10 rounded-full"}>
                    <InputGroupInput placeholder="Search..."/>
                    <InputGroupAddon>
                        <SearchIcon/>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end" className={"rounded-full"}>
                        <InputGroupButton>Search</InputGroupButton>
                    </InputGroupAddon>
                </InputGroup>

                {/* Right side buttons */}
                <div className={"flex gap-4 ml-auto lg:ml-0"}>
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5"/>
                        <span
                            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            3
                        </span>
                    </Button>
                    <UserButton/>
                </div>
            </div>

            {/* Mobile/Tablet Search Bar - Below navbar, hidden on lg+ */}
            <div className="lg:hidden border-t px-4 py-2">
                <InputGroup className={"w-full h-10 rounded-full"}>
                    <InputGroupInput placeholder="Search..."/>
                    <InputGroupAddon>
                        <SearchIcon/>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </nav>
    );
}
