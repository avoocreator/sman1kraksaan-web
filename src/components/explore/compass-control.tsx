export function CompassControl() {
  return (
    <svg viewBox="0 0 120 120" className="h-20 w-20 drop-shadow-sm">
      <circle cx="60" cy="60" r="54" fill="#FFFDF5" stroke="#D9CFA0" strokeWidth="1.5" />
      {[45, 135, 225, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        const x1 = 60 + 54 * Math.sin(rad);
        const y1 = 60 - 54 * Math.cos(rad);
        const x2 = 60 + 46 * Math.sin(rad);
        const y2 = 60 - 46 * Math.cos(rad);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D9CFA0" strokeWidth="2" />;
      })}
      {/* jarum */}
      <polygon points="60,16 68,60 60,60 52,60" fill="#EB662B" />
      <polygon points="60,104 68,60 60,60 52,60" fill="#2E4A54" />
      <circle cx="60" cy="60" r="5" fill="#FFFDF5" stroke="#0F2A33" strokeWidth="2" />
      <text x="60" y="12" textAnchor="middle" fontSize="11" fontWeight={700} fill="#EB662B">N</text>
    </svg>
  );
}