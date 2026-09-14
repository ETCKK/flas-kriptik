import "./globals.css";
import NavigationBar from "@/components/navigation/NavigationBar";
import { Special_Elite, Caveat } from "next/font/google";

const specialElite = Special_Elite({ 
    weight: "400", 
    subsets: ["latin"],
    variable: "--font-typewriter"
});

const caveat = Caveat({ 
    weight: "700", 
    subsets: ["latin"],
    variable: "--font-handwriting" 
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={`pt-20 ${specialElite.variable} ${caveat.variable}`}>
                <NavigationBar />
                {children}
            </body>
        </html>
    );
}