"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function NavigationLink({ href, children }: { href: string; children: ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`relative inline-flex items-center whitespace-nowrap px-2 py-1 text-sm font-bold uppercase tracking-[0.15em] transition-colors ${
                isActive ? "text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-white"
            }`}
        >
            <span aria-hidden="true" className={`mr-1 inline-block w-[0.7em] ${isActive ? "opacity-100" : "opacity-0"}`}>
                &gt;
            </span>
            <span>{children}</span>
        </Link>
    );
}