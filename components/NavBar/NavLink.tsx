"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-full w-48 items-center justify-center px-4 text-base font-semibold transition-colors duration-0 ${
                isActive
                    ? "bg-[#f0eafd] text-[#26745b] shadow-sm"
                    : "text-[#747b99]"
            }`}
        >
            {children}
        </Link>
    );
}