"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { navItems } from "./navItems";

export default function MobileNavMenu() {
    const pathname = usePathname();
    const menuRef = useRef<HTMLDetailsElement>(null);

    useEffect(() => {
        const closeMenu = (event: PointerEvent | KeyboardEvent) => {
            if (event instanceof KeyboardEvent && event.key !== "Escape") return;
            if (
                menuRef.current?.open &&
                event instanceof PointerEvent &&
                !menuRef.current.contains(event.target as Node)
            ) {
                menuRef.current.open = false;
            } else if (event instanceof KeyboardEvent && menuRef.current?.open) {
                menuRef.current.open = false;
            }
        };

        document.addEventListener("pointerdown", closeMenu);
        document.addEventListener("keydown", closeMenu);
        return () => {
            document.removeEventListener("pointerdown", closeMenu);
            document.removeEventListener("keydown", closeMenu);
        };
    }, []);

    const closeMenu = () => {
        if (menuRef.current) menuRef.current.open = false;
    };

    return (
        <details ref={menuRef} className="group relative md:hidden">
            <summary
                aria-label="Navigasyon menüsü"
            className="flex h-11 w-11 cursor-pointer list-none touch-manipulation items-center justify-center border-2 border-[#f2a65a] text-[#f2a65a] transition-colors duration-0 hover:bg-[#f2a65a] hover:text-[#29324d] group-open:bg-[#f2a65a] group-open:text-[#29324d] [&::-webkit-details-marker]:hidden"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                    aria-hidden="true"
                >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </summary>

            <div
                id="mobile-navigation"
                className="absolute left-0 top-full z-50 mt-3 w-56 border-2 border-[#f2a65a] bg-[#29324d] p-2 text-[#fffaf5] shadow-[5px_5px_0_#f2a65a]"
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
                                        ? "bg-[#f2a65a] !text-[#29324d]"
                                        : "!text-[#fffaf5] hover:bg-[#f2a65a] hover:!text-[#29324d]"
                                }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
            </div>
        </details>
    );
}