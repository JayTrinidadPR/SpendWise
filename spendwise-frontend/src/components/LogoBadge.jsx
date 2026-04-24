function LogoBadge({ compact = false }) {
    return (
        <div className={compact ? "logo-badge logo-badge-compact" : "logo-badge"}>
            <img
                className="logo-image"
                src="/spendwise-logo.png"
                alt="SpendWise logo"
            />
            {!compact && <span className="logo-wordmark">SpendWise</span>}
        </div>
    );
}

export default LogoBadge;
