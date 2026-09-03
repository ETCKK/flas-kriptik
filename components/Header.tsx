export default function Header({ text }: { text: string }) {
    return (
        <header
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "5rem 1.5rem",
            }}
        >
            <h1
                style={{
                    margin: 0,
                    color: "#f8fafc",
                    fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.1,
                }}
            >
                {text}
            </h1>
        </header>
    );
}