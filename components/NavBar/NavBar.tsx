import Link from "next/link";
import NavLink from "./NavLink";
import MobileNavMenu from "./MobileNavMenu";
import SettingsMenu from "./SettingsMenu";
import { navItems } from "./navItems";
import Logo from "@/components/icons/Logo";
import ProfileIcon from "@/components/icons/ProfileIcon";

export default function NavBar() {
    return (
        <nav className="fixed inset-x-3 top-3 z-40 border-2 border-[#29324d] bg-[#29324d] text-[#fffaf5] shadow-[6px_6px_0_#df6f61] md:inset-x-auto md:left-1/2 md:w-fit md:-translate-x-1/2">
            <div className="relative grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 md:static md:grid-cols-[auto_auto_auto] md:gap-6 md:px-5">
                <div className="justify-self-start md:pr-2">
                    <MobileNavMenu />
                    <Link
                        href="/"
                        className="group hidden items-center gap-3 text-xl font-black tracking-[-0.04em] text-[#fffaf5] transition-colors hover:text-[#f2a65a] md:flex md:text-2xl"
                    >
                        <span className="h-8 w-8 shrink-0 rotate-[-8deg] transition-transform group-hover:rotate-0">
                            <Logo />
                        </span>
                        flaş kriptik
                    </Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
                    <Link href="/" className="group flex items-center gap-2 whitespace-nowrap text-xl font-black tracking-[-0.04em] text-[#fffaf5]">
                        <span className="h-7 w-7 shrink-0 rotate-[-8deg] transition-transform group-hover:rotate-0">
                            <Logo />
                        </span>
                        flaş kriptik
                    </Link>
                </div>

                <div className="hidden h-full items-center justify-center px-2 md:flex">
                    {navItems.map(({ href, label }) => (
                        <NavLink key={href} href={href}>
                            {label}
                        </NavLink>
                    ))}
                </div>

                <div className="col-start-3 flex items-center justify-self-end text-[#fffaf5]">
                    <SettingsMenu />
                    <Link
                        href="/profil"
                        aria-label="Profil"
                        className="flex h-10 w-10 touch-manipulation items-center justify-center text-[#f2a65a] transition-colors duration-200 hover:bg-[#f2a65a] hover:text-[#29324d]"
                    >
                        <span className="h-7 w-7">
                            <ProfileIcon />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}