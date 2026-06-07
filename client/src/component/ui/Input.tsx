import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, ...props }, ref) => {
    const [show, setShow] = useState(false);
    
    // Check if this is a password field to show the toggle
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label */}
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">
          {label}
        </label>
        
        {/* Input Wrapper */}
        <div className="relative w-full flex items-center">
          <input
            {...props}
            ref={ref}
            type={inputType}
            className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-sm pr-16 shadow-sm ${
              error 
                ? 'border-red-500 focus:ring-red-100' 
                : 'border-slate-200 focus:ring-2 focus:ring-[var(--color-aventon-dark)]'
            }`}
          />
          
          {/* THE TOGGLE: Only shows if type="password" */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 text-[10px] font-black text-aventon-dark uppercase hover:text-aventon-accent cursor-pointer z-20 py-1 px-1"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <span className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight animate-fade-in">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';