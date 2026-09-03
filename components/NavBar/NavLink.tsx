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
            className={`relative flex h-full items-center justify-center px-4 text-sm font-bold uppercase tracking-[0.08em] transition-colors duration-200 ${
                isActive
                    ? "text-[#f2a65a]"
                    : "text-[#c5c9d5] hover:text-[#fffaf5]"
            }`}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-2 left-4 right-4 h-1 bg-[#f2a65a]" />
            )}
        </Link>
    );
}