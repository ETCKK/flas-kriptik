"use client";

import { useEffect, useRef } from "react";
import GearIcon from "@/components/icons/GearIcon";

export default function SettingsMenu() {
    const menuRef = useRef<HTMLDetailsElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const closeMenu = () => {
            if (dialog.open) dialog.close();
            if (menuRef.current) menuRef.current.open = false;
        };
        const syncDetails = () => {
            if (menuRef.current) menuRef.current.open = false;
        };

        dialog.addEventListener("cancel", closeMenu);
        dialog.addEventListener("close", syncDetails);
        return () => {
            dialog.removeEventListener("cancel", closeMenu);
            dialog.removeEventListener("close", syncDetails);
        };
    }, []);

    const openDialog = () => {
        const dialog = dialogRef.current;
        if (menuRef.current?.open && dialog && !dialog.open) dialog.showModal();
    };

    const closeMenu = () => {
        if (dialogRef.current?.open) dialogRef.current.close();
        if (menuRef.current) menuRef.current.open = false;
    };

    return (
        <>
            <details ref={menuRef} onToggle={openDialog} className="group relative">
                <summary
                    aria-label="Ayarlar"
                    className="flex h-10 w-10 cursor-pointer list-none touch-manipulation items-center justify-center text-[#f2a65a] transition-colors duration-200 hover:bg-[#f2a65a] hover:text-[#29324d] [&::-webkit-details-marker]:hidden"
                >
                    <span className="h-5 w-5 transition-transform duration-200 group-open:rotate-45">
                        <GearIcon />
                    </span>
                </summary>
            </details>

            <dialog
                ref={dialogRef}
                aria-labelledby="settings-title"
                onClick={(event) => {
                    if (event.target === event.currentTarget) closeMenu();
                }}
                className="m-auto w-[calc(100%-2.5rem)] max-w-sm border-2 border-[#f2a65a] bg-[#29324d] p-6 text-[#fffaf5] shadow-[6px_6px_0_#f2a65a] backdrop:bg-[#101722]/70"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 id="settings-title" className="mt-2 text-2xl font-black">
                            Ayarlar
                        </h2>
                    </div>
                    <button
                        type="button"
                        aria-label="Ayarları kapat"
                        onClick={closeMenu}
                        className="flex h-12 w-12 items-center justify-center text-5xl leading-none text-[#f2a65a] hover:text-[#fffaf5]"
                    >
                        &times;
                    </button>
                </div>
                <p className="mt-6 border-t border-[#59617d] pt-4 text-sm text-[#c5c9d5]">
                    Yapım aşamasında.
                </p>
            </dialog>
        </>
    );
}
