export default function PartyIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="200" cy="200" r="60" fill="url(#party-grad1)" opacity="0.8" />
      <circle cx="140" cy="150" r="30" fill="url(#party-grad2)" opacity="0.7" />
      <circle cx="260" cy="150" r="30" fill="url(#party-grad3)" opacity="0.7" />
      <circle cx="120" cy="220" r="25" fill="url(#party-grad4)" opacity="0.6" />
      <circle cx="280" cy="220" r="25" fill="url(#party-grad5)" opacity="0.6" />
      <path d="M150 80L160 120L200 130L170 160L180 200L150 180L120 200L130 160L100 130L140 120Z" fill="#FBBF24" />
      <path d="M250 90L258 120L288 128L269 147L274 177L250 163L226 177L231 147L212 128L242 120Z" fill="#F472B6" />
      <path d="M200 40L206 60L226 65L213 78L216 98L200 90L184 98L187 78L174 65L194 60Z" fill="#60A5FA" />
      <line x1="180" y1="100" x2="160" y2="140" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
      <line x1="220" y1="100" x2="240" y2="140" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="200" cy="180" r="8" fill="#FCD34D" />
      <circle cx="220" cy="190" r="6" fill="#FB923C" />
      <circle cx="180" cy="190" r="6" fill="#34D399" />
      <defs>
        <linearGradient id="party-grad1" x1="200" y1="140" x2="200" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="party-grad2" x1="140" y1="120" x2="140" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
        <linearGradient id="party-grad3" x1="260" y1="120" x2="260" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="party-grad4" x1="120" y1="195" x2="120" y2="245" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="party-grad5" x1="280" y1="195" x2="280" y2="245" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
      </defs>
    </svg>
  );
}
