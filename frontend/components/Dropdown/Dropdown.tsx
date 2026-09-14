"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownOption<T extends string | number> = {
  value: T;
  label: string;
};
type Props<T extends string | number> = {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
};

export default function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  className = "",
  disabled = false,
  ariaLabel,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [opensUpward, setOpensUpward] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      0,
      options.findIndex((option) => option.value === value),
    ),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    const index = options.findIndex((option) => option.value === value);
    if (index >= 0) setActiveIndex(index);
  }, [options, value]);
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setOpensUpward(
      window.innerHeight - rect.bottom <
        Math.min(260, options.length * 36 + 10) &&
        rect.top > window.innerHeight - rect.bottom,
    );
  }, [open, options.length]);
  useEffect(() => {
    if (open)
      menuRef.current
        ?.querySelector<HTMLElement>('[data-active="true"]')
        ?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex(
        (index) =>
          (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) %
          options.length,
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(activeIndex);
      else setOpen(true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`dropdown ${open ? "open" : ""} ${className}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-trigger"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className="dropdown-value">{selected?.label ?? ""}</span>
        <span className="dropdown-chevron" aria-hidden="true">
          <ChevronDown size={14} strokeWidth={1.8} />
        </span>
      </button>
      {open && (
        <div
          ref={menuRef}
          className={`dropdown-menu ${opensUpward ? "dropdown-menu-up" : ""}`}
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((option, index) => (
            <button
              key={String(option.value)}
              type="button"
              role="option"
              aria-selected={option.value === value}
              data-active={index === activeIndex}
              className={`dropdown-option ${option.value === value ? "selected" : ""} ${index === activeIndex ? "active" : ""}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => choose(index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
