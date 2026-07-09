export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-lp-border-soft bg-lp-bg px-4 py-8 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-lp-text-dim sm:flex-row">
                <span className="font-bold text-lp-text">PBM Agency</span>

                <a
                    href="https://pbmagency.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-lp-text"
                >
                    pbmagency.id
                </a>

                <span className="font-mono text-xs">
                    &copy; {year} PBM Agency
                </span>
            </div>
        </footer>
    );
}
