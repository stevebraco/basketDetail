import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps {
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  value?: string; // Current value
  onChange?: (value: string) => void; // Change handler
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  success?: boolean; // Success state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder = "Enter your message",
      rows = 3,
      value = "",
      onChange,
      className = "",
      disabled = false,
      success = false,
      error = false,
      hint = "",
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    // Base classes
    let textareaClasses = cn(
      "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden",
      "dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30",
      className
    );

    // Add styles based on different states
    if (disabled) {
      textareaClasses +=
        " bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
    } else if (error) {
      textareaClasses +=
        " bg-transparent text-gray-400 border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800";
    } else if (success) {
      textareaClasses +=
        " bg-transparent text-gray-400 border-gray-300 focus:border-success-300 focus:ring-3 focus:ring-success-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-success-800";
    } else {
      textareaClasses +=
        " bg-transparent text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";
    }

    return (
      <div className="relative">
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={textareaClasses}
        />
        {hint && (
          <p
            className={cn(
              "mt-2 text-xs",
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-muted-foreground"
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
