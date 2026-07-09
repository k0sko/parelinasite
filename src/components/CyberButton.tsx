import { motion } from 'motion/react';

interface CyberButtonProps {
  onClick: () => void;
  text: string;
}

export default function CyberButton({ onClick, text }: CyberButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative px-6 py-2.5 bg-transparent font-tech text-xs font-semibold tracking-wider text-white overflow-hidden group select-none cursor-pointer"
      style={{
        clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)'
      }}
    >
      {/* Background with dynamic red-to-purple gradient overlay */}
      <div className="absolute inset-0 bg-neutral-950/80 group-hover:bg-neutral-900/40 transition-colors duration-300" />
      
      {/* Laser Gradient Accent Border */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-red-600 via-rose-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
        style={{
          padding: '1px',
          clipPath: 'polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Futuristic cyber bracket markers in corners */}
      <span className="absolute top-0 left-0 w-2 h-[1px] bg-red-400 opacity-80" />
      <span className="absolute top-0 left-0 w-[1px] h-2 bg-red-400 opacity-80" />
      
      <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-purple-400 opacity-80" />
      <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-purple-400 opacity-80" />

      {/* Button Text */}
      <span className="relative z-10 flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest text-neutral-200 group-hover:text-white transition-colors duration-200">
        {text}
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:bg-rose-400 group-hover:scale-125 transition-transform duration-200 animate-ping" />
      </span>
    </motion.button>
  );
}
