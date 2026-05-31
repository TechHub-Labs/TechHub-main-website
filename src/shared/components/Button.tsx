/**
 * Button.tsx
 * 
 * Core component/utility for the TechHub application.
 */

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export const Button = ({
  children, // The text inside the button (e.g. "Submit")
  variant = "primary", // Default to 'primary' if nothing is provided
  className = "", // Allow adding extra custom Tailwind classes when used
  ...props // Capture onClick, disabled, type="submit", etc.
}: ButtonProps) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    secondary:
      "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
