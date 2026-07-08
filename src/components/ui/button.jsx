import React from 'react';

export function Button({ children, className = '', variant, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition rounded';
  const variantClass = variant === 'outline' ? 'border border-gray-300 bg-transparent text-gray-800' : 'bg-emerald-600 text-white';
  return (
    <button className={`${base} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
