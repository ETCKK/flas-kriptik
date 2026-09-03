import "./globals.css";
import NavBar from "@/components/NavBar/NavBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className="pt-24">
                <NavBar />
                {children}
            </body>
        </html>
    );
}