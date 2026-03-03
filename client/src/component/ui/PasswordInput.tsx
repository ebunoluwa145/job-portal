import React, { useState, forwardRef } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, type, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">
          {label}
        </label>
        
        <div className="relative w-full flex items-center">
          <input
            {...props}
            ref={ref}
            type={show ? "text" : "password"}
            className={`w-full px-4 py-3 bg-white border rounded-xl outline-none transition-all text-sm pr-20 shadow-sm ${
              error 
                ? 'border-red-500 focus:ring-red-100' 
                : 'border-slate-200 focus:ring-2 focus:ring-aventon-dark'
            }`}
          />
          
          
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 z-50 px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase rounded cursor-pointer"
            style={{ minWidth: '50px', minHeight: '20px' }} 
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        {error && (
          <span className="text-[10px] text-red-500 font-bold px-1 uppercase tracking-tight">
            {error}
          </span>
        )}
      </div>
    );
  }
);