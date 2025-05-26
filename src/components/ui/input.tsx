import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full p-2 border rounded-xl" {...props} />;
}
