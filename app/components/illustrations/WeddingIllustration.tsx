export default function WeddingIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M200 50L220 90L260 100L230 130L238 170L200 150L162 170L170 130L140 100L180 90L200 50Z" fill="url(#wedding-grad1)" />
      <circle cx="160" cy="180" r="40" fill="url(#wedding-grad2)" opacity="0.8" />
      <circle cx="240" cy="180" r="40" fill="url(#wedding-grad2)" opacity="0.8" />
      <path d="M140 220C140 180 160 160 200 160C240 160 260 180 260 220" stroke="url(#wedding-grad3)" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="200" cy="120" r="15" fill="#FFD700" opacity="0.9" />
      <path d="M200 135L195 155L205 155Z" fill="#FFD700" opacity="0.9" />
      <rect x="190" y="240" width="20" height="50" rx="4" fill="url(#wedding-grad4)" />
      <defs>
        <linearGradient id="wedding-grad1" x1="200" y1="50" x2="200" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#DC2626" />
        </linearGradient>
        <linearGradient id="wedding-grad2" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="wedding-grad3" x1="140" y1="220" x2="260" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="wedding-grad4" x1="200" y1="240" x2="200" y2="290" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
