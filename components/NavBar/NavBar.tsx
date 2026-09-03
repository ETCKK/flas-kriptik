import Link from "next/link";
import NavLink from "./NavLink";
import ProfileMenu from "./ProfileMenu";

export default function NavBar() {
    return (
        <nav className="border-b border-[#f2d9d0] bg-[#fffdfb] shadow-[0_4px_20px_rgba(190,128,111,0.08)]">
            <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4">
                <div className="justify-self-start">
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tight text-[#29324d] transition-colors hover:text-[#df6f61]"
                    >
                        Flaş Kriptik
                    </Link>
                </div>

                <div className="flex h-full items-center justify-center">
                    <NavLink href="/bulmaca">Bulmaca</NavLink>
                    <NavLink href="/ogren">Öğren</NavLink>
                    <NavLink href="/arsiv">Arşiv</NavLink>
                </div>

                <div className="justify-self-end">
                    <ProfileMenu />
                </div>
            </div>
        </nav>
    );
}