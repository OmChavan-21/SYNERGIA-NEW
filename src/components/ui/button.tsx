import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    
    let variantClasses = "bg-slate-900 text-slate-50 hover:bg-slate-900/90";
    if (variant === "outline") variantClasses = "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900";
    if (variant === "ghost") variantClasses = "hover:bg-slate-100 hover:text-slate-900";
    if (variant === "secondary") variantClasses = "bg-slate-100 text-slate-900 hover:bg-slate-100/80";
    
    let sizeClasses = "h-10 px-4 py-2";
    if (size === "sm") sizeClasses = "h-9 rounded-md px-3";
    if (size === "lg") sizeClasses = "h-11 rounded-md px-8";

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses,
          sizeClasses,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
