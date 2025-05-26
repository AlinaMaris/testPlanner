import { ButtonHTMLAttributes } from 'react';

export function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="rounded-2xl px-4 py-2 shadow bg-pink-400 text-white hover:bg-pink-500"
      {...props}
    >
      {children}
    </button>
  );
}
