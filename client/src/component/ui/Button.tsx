import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => (
  <button
    {...props}
    className={`w-full py-3 px-6 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-md active:scale-95 ${
      isLoading 
        ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
        : 'bg-aventon-dark text-white hover:bg-aventon-accent'
    }`}
  >
    {isLoading ? 'Processing...' : children}
  </button>
);