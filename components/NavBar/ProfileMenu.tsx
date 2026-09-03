"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                aria-label="Profil menüsü"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 rounded-full p-2 text-[#747b99] transition-colors duration-0 hover:bg-[#f0eafd] hover:text-[#7a65b5]"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.8-3.4 3.2-5.2 7-5.2s6.2 1.8 7 5.2" />
                </svg>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`h-3.5 w-3.5 transition-transform duration-0 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-[#e8def7] bg-[#fffdfb] p-1 shadow-[0_12px_30px_rgba(98,78,139,0.14)]">
                    <Link
                        href="/profil"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-[#59617d] transition-colors duration-0 hover:bg-[#f0eafd] hover:text-[#6953a4]"
                    >
                        Profil
                    </Link>

                    <Link
                        href="/istatistikler"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-[#59617d] transition-colors duration-0 hover:bg-[#f0eafd] hover:text-[#6953a4]"
                    >
                        İstatistikler
                    </Link>

                    <Link
                        href="/ayarlar"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm text-[#59617d] transition-colors duration-0 hover:bg-[#f0eafd] hover:text-[#6953a4]"
                    >
                        Ayarlar
                    </Link>

                    <div className="my-1 border-t border-[#f1e8f8]" />

                    <button
                        type="button"
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-[#59617d] transition-colors duration-0 hover:bg-[#fff0eb] hover:text-[#df6f61]"
                    >
                        Çıkış Yap
                    </button>
                </div>
            )}
        </div>
    );
}