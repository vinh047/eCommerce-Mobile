"use client";
import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import clsx from "clsx";

const sizes = {
  sm: "h-10 text-sm",
  md: "h-12 text-base",
  lg: "h-14 text-base",
};

const leftPad = {
  sm: "pl-3",
  md: "pl-4",
  lg: "pl-5",
};

const leftPadFix = {
  sm: "pl-9",
  md: "pl-10",
  lg: "pl-11",
};

const rightPadFix = {
  sm: "pr-10",
  md: "pr-12",
  lg: "pr-12",
};

export const Input = forwardRef(
  (
    {
      type = "text",
      size = "md",
      leftIcon,
      rightAddon,
      error,
      helperText,
      disabled,
      showPasswordToggle = true,
      containerClassName,
      className,
      fullWidth,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false);
    const isPassword = type === "password";
    const actualType =
      isPassword && showPasswordToggle ? (show ? "text" : "password") : type;

    const inputClass = clsx(
      "rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400",
      "border border-neutral-300 shadow-sm",
      "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60",
      "disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full",
      sizes[size],
      error && [
        "border-red-500",
        "focus:ring-red-500",
        "focus:border-red-500",
        "placeholder:text-red-500"
      ],
      leftIcon ? leftPadFix[size] : leftPad[size],
      (rightAddon || isPassword) && rightPadFix[size],
      className
    );

    return (
      <div className={clsx(fullWidth && "w-full", containerClassName)}>
        <div className="relative">
          {leftIcon && (
            <span
              className={clsx(
                "pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center text-neutral-400",
                size === "sm" ? "w-9" : size === "md" ? "w-10" : "w-11"
              )}
            >
              {leftIcon}
            </span>
          )}

          {rightAddon ? (
            <span
              className={clsx(
                "absolute inset-y-0 right-6 flex items-center justify-center",
                size === "sm" ? "w-10" : "w-12"
              )}
            >
              {rightAddon}
            </span>
          ) : (
            isPassword &&
            showPasswordToggle && (
              <span
                className={clsx(
                  "absolute inset-y-0 right-2 flex items-center justify-center",
                  size === "sm" ? "w-10" : "w-12"
                )}
              >
                <Button
                  type="button"
                  iconOnly
                  size="sm"
                  ghost
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShow((v) => !v)}
                  aria-pressed={show}
                  aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  title={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {show ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </span>
            )
          )}

          <input
            ref={ref}
            type={actualType}
            disabled={disabled}
            className={inputClass}
            {...props}
          />
        </div>

        {(error || helperText) && (
          <motion.p
            key={error}
            initial={{ x: 0 }}
            animate={error ? { x: [0, -2, 2, -1, 1, 0] } : { x: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={clsx(
              "mt-1 text-xs",
              error ? "text-red-500" : "text-neutral-500"
            )}
          >
            {error ?? helperText}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
