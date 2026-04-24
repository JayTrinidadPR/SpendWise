function LogoBadge({ compact = false }) {
    return (
        <div className={compact ? "logo-badge logo-badge-compact" : "logo-badge"}>
            <span className="logo-mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" role="img" focusable="false">
                    <rect x="4" y="4" width="32" height="32" rx="16" />
                    <path d="M14 14.5c0-1.4 1.1-2.5 2.5-2.5h5.2c.8 0 1.5.3 2.1.8l2.2 2.1c.5.5.8 1.2.8 1.9v6.7c0 1.4-1.1 2.5-2.5 2.5h-7.7c-1.4 0-2.5-1.1-2.5-2.5v-9Z" />
                    <path d="m16.8 20.2 2.4 2.4 4.6-5.2" />
                </svg>
            </span>
            <span className="logo-wordmark">SpendWise</span>
        </div>
    );
}

export default LogoBadge;
