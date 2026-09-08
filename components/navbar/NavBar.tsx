import Link from "next/link";
import NavLink from "./NavLink";
import MobileNavMenu from "./MobileNavMenu";
import SettingsMenu from "./SettingsMenu";
import { navItems } from "./navItems";
import Logo from "@/components/icons/Logo";
import ProfileIcon from "@/components/icons/ProfileIcon";

export default function NavBar() {
    return (
        <nav className="fixed left-3 right-3 top-3 z-40 mx-auto max-w-2xl rounded-sm border-2 border-surface bg-surface text-ink shadow-[6px_6px_0_var(--color-shadow)]">
            <div className="relative grid h-[4.25rem] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 md:static md:grid-cols-[auto_auto_auto] md:gap-6 md:px-5">
                <div className="justify-self-start md:pr-2">
                    <MobileNavMenu />
                    <Link
                        href="/"
                        className="group hidden items-center gap-3 text-xl font-black tracking-[-0.04em] text-ink transition-colors hover:text-accent md:flex md:text-2xl"
                    >
                        <span className="h-8 w-8 shrink-0 rotate-[-8deg] transition-transform group-hover:rotate-0">
                            <Logo />
                        </span>
                        flaş kriptik
                    </Link>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
                    <Link href="/" className="group flex items-center gap-2 whitespace-nowrap text-xl font-black tracking-[-0.04em] text-ink">
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

                <div className="col-start-3 flex md:gap-2 items-center justify-self-end text-ink">
                    <SettingsMenu />
                    <Link
                        href="/profil"
                        aria-label="Profil"
                        className="flex h-10 w-10 rounded-xs touch-manipulation items-center justify-center text-accent transition-colors duration-100 hover:bg-accent hover:text-surface"
                    >
                        <span className="h-7 w-7 text-ink">
                            <ProfileIcon />
                        </span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}