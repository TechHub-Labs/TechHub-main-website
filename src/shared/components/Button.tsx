/**
 * WHAT IS THIS FILE?
 * 
 * A globally reusable, custom-styled Button component.
 * 
 * WHY IS THIS USEFUL?
 * Instead of writing a massive Tailwind string (like `bg-blue-600 text-white rounded p-4...`) 
 * 50 times across the site, we write it ONCE here. 
 * If the community decides buttons should be round instead of square, we only update this file!
 */

import { ButtonHTMLAttributes } from 'react';

// Define the properties this Button can receive. 
// `ButtonHTMLAttributes<HTMLButtonElement>` means our button automatically accepts standard HTML properties like `onClick` or `disabled`.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // `variant` lets us easily switch the color theme of the button!
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ 
  children, // The text inside the button (e.g. "Submit")
  variant = 'primary', // Default to 'primary' if nothing is provided
  className = '', // Allow adding extra custom Tailwind classes when used
  ...props // Capture onClick, disabled, type="submit", etc.
}: ButtonProps) => {

  // BASE STYLE: Shared across all buttons (Animations, padding, general shape)
  const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // VARIANTS: Defines the unique colors for each style
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    secondary: "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400"
  };

  return (
    <button 
      // We dynamically smash the baseStyle, the variant color, and any custom classes together!
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
