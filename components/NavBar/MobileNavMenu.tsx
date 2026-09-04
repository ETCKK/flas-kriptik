"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItems } from "./navItems";

export default function MobileNavMenu() {
    const pathname = usePathname();
    const menuRef = useRef<HTMLDetailsElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const openMenu = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsMounted(true);
        requestAnimationFrame(() => setIsOpen(true));
    };

    const closeMenu = () => {
        setIsOpen(false);
        closeTimeoutRef.current = setTimeout(() => setIsMounted(false), 200);
    };

    useEffect(() => {
        const handleDocumentEvent = (event: PointerEvent | KeyboardEvent) => {
            if (event instanceof KeyboardEvent && event.key !== "Escape") return;
            if (
                menuRef.current?.open &&
                event instanceof PointerEvent &&
                !menuRef.current.contains(event.target as Node)
            ) {
                closeMenu();
            } else if (event instanceof KeyboardEvent && menuRef.current?.open) {
                closeMenu();
            }
        };

        document.addEventListener("pointerdown", handleDocumentEvent);
        document.addEventListener("keydown", handleDocumentEvent);
        return () => {
            document.removeEventListener("pointerdown", handleDocumentEvent);
            document.removeEventListener("keydown", handleDocumentEvent);
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    return (
        <details ref={menuRef} open={isMounted} className="group relative md:hidden">
            <summary
                aria-label="Navigasyon menüsü"
                onClick={(event) => {
                    event.preventDefault();
                    isOpen ? closeMenu() : openMenu();
                }}
                className={`flex h-11 w-11 cursor-pointer list-none touch-manipulation items-center justify-center border-2 border-accent text-accent transition-[background-color,color] duration-200 hover:bg-accent hover:text-surface [&::-webkit-details-marker]:hidden ${isOpen ? "bg-accent text-surface" : ""}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`h-6 w-6 transition-colors duration-200 ${isOpen ? "text-surface" : "text-accent group-hover:text-surface"}`}
                    aria-hidden="true"
                >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </summary>

            {isMounted && <div
                id="mobile-navigation"
                className={`absolute left-0 top-full z-50 mt-3 w-56 origin-top border-2 border-accent bg-surface p-2 text-ink shadow-[5px_5px_0_var(--color-accent)] transition-all duration-200 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
            >
                    {navItems.map(({ href, label }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={isActive ? "page" : undefined}
                                onClick={closeMenu}
                                className={`block px-3 py-2 text-sm font-semibold transition-colors ${
                                    isActive
                                        ? "bg-accent !text-surface"
                                        : "!text-ink hover:bg-accent hover:!text-surface"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
            </div>}
        </details>
    );
}