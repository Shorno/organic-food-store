"use client"

import {type Icon} from "@tabler/icons-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar"
import {LucideIcon} from "lucide-react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string
        url: string
        icon?: Icon | LucideIcon
    }[]
}) {
    const {setOpenMobile} = useSidebar()

    const pathname = usePathname();
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2 mt-8">
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = pathname === item.url;
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    onClick={() => setOpenMobile(false)}
                                    isActive={isActive}
                                    className="flex items-cente gap-3 px-3 h-12 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-green-400 data-[active=true]:text-accent-foreground"

                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon size={20}/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
