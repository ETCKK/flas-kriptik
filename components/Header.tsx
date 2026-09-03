export default function Header({ text }: { text: string }) {
    return (
        <header className="relative z-0 flex flex-col items-center justify-center px-6 pb-16 pt-10 text-center md:py-24">
            <h1 className="m-0 text-4xl font-extrabold leading-tight tracking-tight text-[#f2a65a] md:text-5xl lg:text-6xl">
                {text}
            </h1>
        </header>
    );
}