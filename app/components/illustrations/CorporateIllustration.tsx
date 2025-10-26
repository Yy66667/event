export default function CorporateIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect x="120" y="100" width="160" height="180" rx="8" fill="url(#corp-grad1)" />
      <rect x="135" y="120" width="30" height="30" rx="4" fill="#60A5FA" opacity="0.8" />
      <rect x="185" y="120" width="30" height="30" rx="4" fill="#34D399" opacity="0.8" />
      <rect x="235" y="120" width="30" height="30" rx="4" fill="#FBBF24" opacity="0.8" />
      <rect x="135" y="165" width="30" height="30" rx="4" fill="#F472B6" opacity="0.8" />
      <rect x="185" y="165" width="30" height="30" rx="4" fill="#A78BFA" opacity="0.8" />
      <rect x="235" y="165" width="30" height="30" rx="4" fill="#FB923C" opacity="0.8" />
      <rect x="135" y="210" width="130" height="50" rx="6" fill="url(#corp-grad2)" />
      <circle cx="200" cy="60" r="35" fill="url(#corp-grad3)" />
      <path d="M200 45L205 55L216 57L208 65L210 76L200 71L190 76L192 65L184 57L195 55Z" fill="#FCD34D" />
      <rect x="150" y="225" width="100" height="4" rx="2" fill="#1F2937" opacity="0.3" />
      <rect x="150" y="235" width="70" height="4" rx="2" fill="#1F2937" opacity="0.3" />
      <rect x="150" y="245" width="90" height="4" rx="2" fill="#1F2937" opacity="0.3" />
      <defs>
        <linearGradient id="corp-grad1" x1="200" y1="100" x2="200" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="corp-grad2" x1="200" y1="210" x2="200" y2="260" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="corp-grad3" x1="200" y1="25" x2="200" y2="95" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}
