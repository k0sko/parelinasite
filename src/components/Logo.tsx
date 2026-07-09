import { motion } from 'motion/react';

export default function Logo() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center select-none cursor-pointer group"
    >
      {/* Precision Ventilation Design Logo */}
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transform group-hover:rotate-45 transition-transform duration-700 ease-out"
      >
        {/* Engineering outer measurement ring */}
        <circle cx="50" cy="50" r="42" stroke="#ef4444" strokeWidth="1.5" className="opacity-40" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="34" stroke="#ffffff" strokeWidth="1" className="opacity-25" />
        
        {/* Precision compass alignment lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#ef4444" strokeWidth="0.5" className="opacity-20" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="#ef4444" strokeWidth="0.5" className="opacity-20" />

        {/* Dynamic Ventilation Impeller / Blades representing air-flow */}
        <g className="origin-center animate-spin" style={{ animationDuration: '12s' }}>
          {/* Blade 1 */}
          <path 
            d="M50 50 C40 35, 30 40, 26 50 C32 55, 45 52, 50 50Z" 
            fill="url(#bladeGradient)" 
            className="opacity-90"
          />
          {/* Blade 2 */}
          <path 
            d="M50 50 C65 40, 60 30, 50 26 C45 32, 48 45, 50 50Z" 
            fill="url(#bladeGradient)" 
            className="opacity-90"
          />
          {/* Blade 3 */}
          <path 
            d="M50 50 C60 65, 70 60, 74 50 C68 45, 55 48, 50 50Z" 
            fill="url(#bladeGradient)" 
            className="opacity-90"
          />
          {/* Blade 4 */}
          <path 
            d="M50 50 C35 60, 40 70, 50 74 C55 68, 52 55, 50 50Z" 
            fill="url(#bladeGradient)" 
            className="opacity-90"
          />
          
          {/* Central hub */}
          <circle cx="50" cy="50" r="6" fill="#0a0a0a" stroke="#ef4444" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="2" fill="#ffffff" />
        </g>

        {/* Gradients */}
        <defs>
          <radialGradient id="bladeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>
        </defs>
      </svg>

      {/* Brand Text */}
      <span className="font-tech text-xs tracking-[0.35em] text-white font-extrabold leading-none mt-2 select-none text-center">
        PARELINA
      </span>
      <span className="font-sans text-[7px] tracking-[0.2em] text-neutral-400 font-medium uppercase mt-1">
        VENTILATION DESIGN
      </span>
    </motion.div>
  );
}
