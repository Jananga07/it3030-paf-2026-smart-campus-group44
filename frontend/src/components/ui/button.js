import React from "react";

export function Button({ variant = "solid", size = "md", className = "", disabled = false, children, ...props }) {
  const variants = {
    solid: "bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent",
    outline: "bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
  };
  const sizes = {
    sm: "h-9 px-3 rounded-lg text-sm",
    md: "h-10 px-4 rounded-lg text-sm",
    lg: "h-12 px-6 rounded-xl text-base",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${sizes[size] || sizes.md} ${variants[variant] || variants.solid} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
