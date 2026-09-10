import "./globals.css";
import NavigationBar from "@/components/navigation/NavigationBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className="pt-20">
                <NavigationBar />
                {children}
            </body>
        </html>
    );
}