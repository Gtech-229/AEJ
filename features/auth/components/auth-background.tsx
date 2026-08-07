export function AuthIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M120 90 L210 70 L270 110 L290 170 L260 230 L280 280 L230 330 L160 320 L110 270 L90 200 L70 140 Z"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
        <line x1="120" y1="90" x2="210" y2="70" />
        <line x1="210" y1="70" x2="270" y2="110" />
        <line x1="270" y1="110" x2="290" y2="170" />
        <line x1="290" y1="170" x2="260" y2="230" />
        <line x1="260" y1="230" x2="280" y2="280" />
        <line x1="160" y1="320" x2="110" y2="270" />
        <line x1="110" y1="270" x2="90" y2="200" />
        <line x1="90" y1="200" x2="70" y2="140" />
        <line x1="120" y1="90" x2="180" y2="160" />
        <line x1="180" y1="160" x2="230" y2="330" />
        <line x1="180" y1="160" x2="270" y2="110" />
        <line x1="180" y1="160" x2="90" y2="200" />
      </g>
      {[
        [120, 90], [210, 70], [270, 110], [290, 170], [260, 230], [280, 280],
        [230, 330], [160, 320], [110, 270], [90, 200], [70, 140], [180, 160],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 11 ? 5 : 3} fill="rgba(255,255,255,0.35)" />
      ))}
      <circle cx="180" cy="160" r="12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1">
        <animate attributeName="r" values="8;20;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export function FloatingParticles() {
  const particles = [
    { size: 70, top: '5%', left: '8%', delay: '0s', duration: '9s' },
    { size: 28, top: '75%', left: '85%', delay: '1.5s', duration: '7s' },
    { size: 44, top: '20%', left: '90%', delay: '0.8s', duration: '10s' },
    { size: 18, top: '88%', left: '15%', delay: '2.2s', duration: '8s' },
    { size: 36, top: '55%', left: '3%', delay: '3s', duration: '11s' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/10"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animation: `auth-float-particle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes auth-float-particle {
          0%, 100% { transform: translate(0, 0); opacity: 0.4; }
          50% { transform: translate(10px, -16px); opacity: 0.8; }
        }
        @keyframes auth-card-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
