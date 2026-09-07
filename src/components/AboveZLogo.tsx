import React from 'react';

interface AboveZLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const AboveZLogo: React.FC<AboveZLogoProps> = ({ 
  className = '', 
  size = 40,
}) => {
  return (
    <svg 
      viewBox="0 0 500 500" 
      width={size} 
      height={size} 
      className={`shrink-0 drop-shadow-xs ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="logo-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.15" floodColor="#0f172a" />
        </filter>
      </defs>

      {/* Base White Circle */}
      <circle cx="250" cy="250" r="236" fill="#ffffff" filter="url(#logo-shadow)" />

      {/* Outer Blue Ring */}
      <circle cx="250" cy="250" r="226" fill="none" stroke="#2563eb" strokeWidth="8" />

      {/* Inner Blue Ring */}
      <circle cx="250" cy="250" r="206" fill="none" stroke="#1d4ed8" strokeWidth="5.5" />

      {/* Wordmark: Above */}
      <g transform="translate(82, 232)">
        <text 
          x="0" 
          y="0" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="82" 
          fontWeight="900" 
          fill="#1e40af" 
          letterSpacing="-1.5"
        >
          Above
        </text>
      </g>

      {/* 'Z' with upward-right Arrow (AboveZ Emblem) */}
      <g transform="translate(332, 172)">
        {/* Main 'Z' Body */}
        <path d="M 0 60 L 56 60 L 18 16 L 48 16 L 48 0 L 0 0 L 0 8 L 34 48 L 0 48 Z" fill="#1e40af" />
        {/* Upward-Right Growth Arrow */}
        <path d="M 38 28 L 72 -4 L 54 -6 L 80 -10 L 80 16 L 72 -2 L 38 28 Z" fill="#2563eb" />
      </g>

      {/* Horizontal Underline */}
      <rect x="82" y="248" width="336" height="5.5" rx="2.75" fill="#1d4ed8" />

      {/* Tagline: THE BEST CREW PLATFORM */}
      <text 
        x="250" 
        y="275" 
        textAnchor="middle" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="17" 
        fontWeight="800" 
        fill="#1e40af" 
        letterSpacing="4"
      >
        THE BEST CREW PLATFORM
      </text>

      {/* Lineup of 6 Crew Silhouettes */}
      <g fill="#1e3a8a">
        {/* 1. Host / MC with microphone */}
        <circle cx="160" cy="308" r="7.5" />
        <path d="M 152 305 Q 160 298 168 305 Q 168 314 162 316 Q 155 315 152 305 Z" fill="#172554" />
        <path d="M 151 318 C 149 324 147 335 148 346 L 172 346 C 173 335 171 324 169 318 Z" />
        <path d="M 151 320 L 144 334 L 148 336 L 153 325 Z" />
        <path d="M 169 320 L 175 328 L 172 332 L 167 324 Z" />
        <circle cx="175" cy="322" r="3" fill="#172554" />
        <path d="M 175 325 Q 168 338 165 352 Q 160 370 144 380 Q 138 375 146 360" fill="none" stroke="#1e3a8a" strokeWidth="2" />
        <path d="M 149 346 L 147 395 L 156 395 L 159 360 L 162 360 L 165 395 L 173 395 L 171 346 Z" fill="#172554" />

        {/* 2. Lighting Crew adjusting stage spotlight */}
        <circle cx="206" cy="316" r="7" />
        <path d="M 199 316 Q 201 310 208 312 Q 210 319 197 324" fill="#172554" />
        <path d="M 197 326 C 196 333 195 342 196 352 L 215 352 C 216 342 215 333 214 326 Z" />
        <path d="M 211 326 L 223 320 L 225 324 L 214 332 Z" />
        <path d="M 200 326 L 215 322 L 217 325 L 202 332 Z" />
        <path d="M 196 352 L 194 395 L 203 395 L 206 365 L 208 365 L 211 395 L 219 395 L 215 352 Z" fill="#172554" />
        <ellipse cx="229" cy="314" rx="8" ry="11" fill="#172554" />
        <circle cx="229" cy="314" r="5" fill="#93c5fd" />
        <line x1="229" y1="325" x2="229" y2="368" stroke="#172554" strokeWidth="2.5" />
        <line x1="229" y1="368" x2="217" y2="395" stroke="#172554" strokeWidth="2" />
        <line x1="229" y1="368" x2="241" y2="395" stroke="#172554" strokeWidth="2" />

        {/* 3. Production Crew holding equipment case */}
        <circle cx="259" cy="311" r="7.5" />
        <path d="M 250 321 C 248 328 247 340 248 350 L 269 350 C 270 340 269 328 267 321 Z" />
        <path d="M 255 321 L 259 332 L 263 321" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
        <rect x="257" y="332" width="4" height="6" fill="#ffffff" />
        <path d="M 250 323 L 246 348 L 250 349 L 254 327 Z" />
        <rect x="238" y="347" width="22" height="17" rx="2.5" fill="#172554" />
        <rect x="245" y="344" width="8" height="3" rx="1" fill="#172554" />
        <path d="M 248 350 L 246 395 L 255 395 L 258 362 L 260 362 L 263 395 L 273 395 L 269 350 Z" fill="#172554" />

        {/* 4. Event Coordinator with clipboard */}
        <circle cx="293" cy="314" r="7" />
        <path d="M 289 310 A 5 5 0 0 1 297 310" fill="none" stroke="#172554" strokeWidth="2" />
        <circle cx="297" cy="314" r="2" fill="#172554" />
        <path d="M 284 324 C 283 331 283 342 284 350 L 303 350 C 304 342 304 331 303 324 Z" />
        <path d="M 285 325 L 290 338 L 298 335 L 295 325 Z" />
        <rect x="290" y="330" width="10" height="15" rx="1" transform="rotate(-15 295 337)" fill="#172554" />
        <rect x="291" y="332" width="7" height="11" transform="rotate(-15 295 337)" fill="#ffffff" />
        <path d="M 284 350 L 282 395 L 291 395 L 294 362 L 296 362 L 299 395 L 307 395 L 303 350 Z" fill="#172554" />

        {/* 5. Sound / AV Console Engineer */}
        <circle cx="329" cy="314" r="7.5" />
        <path d="M 320 324 C 319 332 319 342 320 350 L 339 350 C 340 342 339 332 337 324 Z" />
        <path d="M 334 326 L 340 338 L 343 338 L 337 325 Z" />
        <rect x="334" y="339" width="22" height="6" rx="1.5" fill="#172554" />
        <line x1="345" y1="345" x2="345" y2="395" stroke="#172554" strokeWidth="2.5" />
        <line x1="337" y1="395" x2="353" y2="395" stroke="#172554" strokeWidth="2.5" />
        <path d="M 320 350 L 318 395 L 327 395 L 330 362 L 332 362 L 334 395 L 342 395 L 339 350 Z" fill="#172554" />

        {/* 6. Stage Manager Pointing */}
        <circle cx="371" cy="314" r="7" />
        <path d="M 362 324 C 361 332 361 342 362 350 L 381 350 C 382 342 381 332 379 324 Z" />
        <path d="M 377 325 L 398 322 L 398 326 L 379 332 Z" />
        <path d="M 363 325 L 356 312 L 359 310 L 367 324 Z" />
        <path d="M 362 350 L 360 395 L 369 395 L 372 362 L 374 362 L 377 395 L 385 395 L 381 350 Z" fill="#172554" />
      </g>
    </svg>
  );
};
