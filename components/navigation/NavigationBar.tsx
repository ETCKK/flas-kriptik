import Link from "next/link";
import NavigationLink from "./NavigationLink";
import MobileNavigationMenu from "./MobileNavigationMenu";
import SettingsPanel from "./SettingsPanel";
import { navigationItems } from "./navigationItems";
import Logo from "@/components/icons/Logo";
import ProfileIcon from "@/components/icons/ProfileIcon";

export default function NavigationBar() {
    return (
        <nav className="fixed left-1/2 top-3 z-50 flex h-14 w-[calc(100%-1rem)] max-w-2xl -translate-x-1/2 items-center justify-between rounded-sm border-2 border-divider bg-surface/95 px-3 font-typewriter text-ink shadow-[0_6px_0_rgba(0,0,0,0.4)] backdrop-blur-md sm:top-4 sm:w-[calc(100%-2rem)] sm:px-5">
            
            <div className="flex flex-1 items-center md:hidden">
                <MobileNavigationMenu />
            </div>
            <div className="hidden flex-1 items-center md:flex">
                <Link href="/" aria-label="Flaş Kriptik ana sayfa" className="flex h-8 w-8 text-accent transition-colors hover:text-white">
                    <Logo />
                </Link>
            </div>

            <div className="flex flex-1 items-center justify-center md:hidden">
                <Link href="/" aria-label="Flaş Kriptik ana sayfa" className="flex h-8 w-8 text-accent transition-colors hover:text-white">
                    <Logo />
                </Link>
            </div>
            <div className="hidden flex-1 items-center justify-center gap-4 md:flex">
                {navigationItems.map(({ href, label }) => (
                    <NavigationLink key={href} href={href}>
                        {label}
                    </NavigationLink>
                ))}
            </div>

            <div className="flex flex-1 items-center justify-end gap-3 text-xs font-bold tracking-widest text-muted sm:gap-4 sm:text-sm">
                <SettingsPanel />
                <Link href="/profil" aria-label="Profil"className="flex h-7 w-7 text-muted transition-colors hover:text-accent">
                    <ProfileIcon />
                </Link>
            </div>
            
        </nav>
    );
}