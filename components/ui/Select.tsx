"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChevronDownIcon } from "@/components/ui/Icons";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: any) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedOption = options.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (val: string | number) => {
    onChange(val);
    setIsOpen(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        tabIndex={disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex w-full cursor-pointer items-center justify-between rounded-xl border bg-surface px-3 py-2 text-sm text-theme-text outline-none transition duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10 ${
          disabled ? "cursor-not-allowed opacity-60" : "border-theme-border hover:border-primary/40"
        } ${isOpen ? "border-primary ring-4 ring-primary/10" : ""}`}
      >
        <span className={!selectedOption || value === "" || value === 0 ? "text-theme-muted" : "truncate font-medium"}>
          {displayValue}
        </span>
        <ChevronDownIcon className={`h-4 w-4 text-theme-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-theme-border bg-surface p-1.5 shadow-lg focus:outline-none">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                  isSelected ? "bg-primary-soft text-primary font-medium" : "text-theme-text hover:bg-slate-50"
                }`}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
