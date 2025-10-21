import { User, LogOut, ShoppingBag, UserCircle, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import type { LucideIcon } from "lucide-react";

type NavigationItem = {
    label: string;
    href?: string;
    icon: LucideIcon;
    onClick?: () => void;
    variant?: "default" | "destructive";
};

export default function UserButton() {
    const { data, isPending } = authClient.useSession();

    if (isPending) {
        return <Skeleton className="size-7 rounded-full" />;
    }

    const handleLogout = async () => {
        await authClient.signOut();
    };

    const isAdmin = data?.user?.role === "admin";

    const adminNavItems: NavigationItem[] = [
        {
            label: "Dashboard",
            href: "/admin/dashboard/orders",
            icon: LayoutDashboard,
        },
    ];

    const userNavItems: NavigationItem[] = [
        {
            label: "My Orders",
            href: "/account/orders",
            icon: ShoppingBag,
        },
        {
            label: "Profile",
            href: "/account/profile",
            icon: UserCircle,
        },
    ];

    const logoutItem: NavigationItem = {
        label: "Logout",
        icon: LogOut,
        onClick: handleLogout,
        variant: "destructive",
    };

    const navigationItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="size-7 cursor-pointer">
                    {data?.user ? (
                        <>
                            <AvatarImage src={data.user.image || ""} />
                            <AvatarFallback>{data.user.name?.[0]}</AvatarFallback>
                        </>
                    ) : (
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {data?.user && (
                    <>
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{data.user.name}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {data.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </>
                )}

                {navigationItems.map((item) => (
                    <DropdownMenuItem key={item.label} asChild={!!item.href}>
                        {item.href ? (
                            <Link href={item.href} className="cursor-pointer">
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Link>
                        ) : (
                            <div onClick={item.onClick} className="cursor-pointer">
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </div>
                        )}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={logoutItem.onClick}
                    className="cursor-pointer text-red-600"
                >
                    <logoutItem.icon className="mr-2 h-4 w-4" />
                    {logoutItem.label}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
