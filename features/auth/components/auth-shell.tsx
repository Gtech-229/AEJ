/** Branded card shell shared by the sign-in and OTP pages. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-svh items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1a7a3c 0%, #0f5228 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl bg-card shadow-2xl">
          <div className="px-8 py-8 text-center text-white" style={{ backgroundColor: '#1a7a3c' }}>
            <span className="text-2xl font-bold tracking-tight">
              Agence <span style={{ color: '#f97316' }}>Emploi</span> Jeunes
            </span>
            <p className="mt-1 text-sm text-white/70">Programme Social du Gouvernement</p>
          </div>
          <div className="px-8 py-8">
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && <p className="mt-1 mb-6 text-sm text-muted-foreground">{subtitle}</p>}
            {!subtitle && <div className="mb-6" />}
            {children}
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/50">
          © 2026 Agence Emploi Jeunes | Financement BAD
        </p>
      </div>
    </div>
  );
}
