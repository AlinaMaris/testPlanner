import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
}

export function Input({ variant = 'default', className = '', ...props }: InputProps) {
  const baseClasses = "w-full p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white/90 backdrop-blur-sm";
  
  const variantClasses = {
    default: "border border-neutral-300 focus:border-primary-500 focus:ring-primary-500 text-neutral-700 placeholder-neutral-400",
    error: "border border-red-300 focus:border-red-500 focus:ring-red-500 text-neutral-700 placeholder-neutral-400"
  };

  return (
    <input 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`} 
      {...props} 
    />
  );
}
