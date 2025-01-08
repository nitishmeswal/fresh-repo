"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, placeholder, children, className }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative w-full cursor-default rounded-lg bg-gray-800/50 py-2 pl-3 pr-10 text-left text-gray-300 shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm",
          className
        )}
      >
        <span className="block truncate">{value || placeholder}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onClick: () => {
                  onValueChange(child.props.value);
                  setOpen(false);
                },
              });
            }
            return child;
          })}
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-300 hover:bg-gray-700",
        className
      )}
    >
      <span className="block truncate">{children}</span>
      {value && (
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
          <Check className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
    </div>
  );
}
