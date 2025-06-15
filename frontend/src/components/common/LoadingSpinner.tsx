import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  className?: string;
}

/**
 * LoadingSpinner component for displaying a loading indicator
 *
 * @param size - Size of the spinner: 'small', 'medium' (default), or 'large'
 * @param color - Color for the spinner border (defaults to primarygreen-1)
 * @param className - Additional CSS classes to apply
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "medium", color = "border-primarygreen-1", className = "" }) => {
  // Size mapping
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-10 w-10",
    large: "h-16 w-16",
  };

  const spinnerClasses = `
    animate-spin 
    rounded-full 
    ${sizeClasses[size]} 
    border-t-2 
    border-b-2 
    ${color}
    ${className}
  `;

  return <div className={spinnerClasses}></div>;
};

export default LoadingSpinner;
