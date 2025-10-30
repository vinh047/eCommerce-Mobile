import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none rounded-2xl font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [aria-disabled=true]:cursor-not-allowed [aria-disabled=true]:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600";

const sizes = {
  xs: "h-8 px-3 text-[12px]",
  sm: "h-9 px-3.5 text-[14px]",
  md: "h-10 px-4 text-[16px]",
  lg: "h-12 px-5 text-[18px]",
  xl: "h-14 px-6 text-[20px]",
};

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
  outline: "border border-slate-300 text-slate-900",
  ghost: "text-slate-900 hover:bg-slate-100",
  success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
  warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Button = forwardRef(
  (
    {
      children,
      size = "md",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconOnly = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      type = "button",
      as: As = "button",
      "aria-label": ariaLabel,
      primary,
      secondary,
      outline,
      ghost,
      success,
      warning,
      danger,
      ...rest
    },
    ref
  ) => {
    const content = (
      <>
        {loading && (
          <Loader2
            aria-hidden
            className={cn("animate-spin", iconOnly ? "h-5 w-5" : "h-4 w-4")}
          />
        )}
        {!loading && LeftIcon && (
          <LeftIcon aria-hidden className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {children}

        {!loading && RightIcon && (
          <RightIcon aria-hidden className={iconOnly ? "h-5 w-5" : "h-4 w-4"} />
        )}
        {loading && !iconOnly && (
          <span role="status" aria-live="polite" className="sr-only">
            Đang xử lý
          </span>
        )}
      </>
    );

    const iconOnlySize = {
      xs: "h-8 w-8 p-0",
      sm: "h-9 w-9 p-0",
      md: "h-10 w-10 p-0",
      lg: "h-12 w-12 p-0",
      xl: "h-14 w-14 p-0",
    };

    const appliedVariant =
      primary
        ? "primary"
        : secondary
        ? "secondary"
        : outline
        ? "outline"
        : ghost
        ? "ghost"
        : success
        ? "success"
        : warning
        ? "warning"
        : danger
        ? "danger"
        : "secondary";

    const computedClass = cn(
      base,
      variants[appliedVariant],
      iconOnly ? iconOnlySize[size] : sizes[size],
      fullWidth && "w-full",
      className
    );

    const isDisabled = disabled || loading;
    const isNativeButton = As === "button";

    return (
      <As
        ref={ref}
        className={computedClass}
        type={isNativeButton ? type : undefined}
        role={isNativeButton ? undefined : "button"}
        aria-busy={loading || undefined}
        aria-disabled={!isNativeButton && isDisabled ? true : undefined}
        disabled={isNativeButton ? isDisabled : undefined}
        aria-label={iconOnly ? ariaLabel : undefined}
        data-variant={appliedVariant}
        data-size={size}
        {...rest}
      >
        {content}
      </As>
    );
  }
);

Button.displayName = "Button";

export function BuyNowButton(props) {
  return (
    <Button primary size="lg" {...props}>
      Mua ngay
    </Button>
  );
}

export function AddToCartButton(props) {
  return (
    <Button secondary size="lg" {...props}>
      Thêm vào giỏ
    </Button>
  );
}
