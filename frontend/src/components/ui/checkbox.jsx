import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
    <div
        ref={ref}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onCheckedChange?.(!checked)}
        onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault()
                onCheckedChange?.(!checked)
            }
        }}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-[#0f172a] ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#0f172a] data-[state=checked]:text-white transition-all cursor-pointer flex items-center justify-center",
            checked ? "bg-[#0f172a] text-white" : "bg-transparent",
            className
        )}
        {...props}
    >
        {checked && (
            <Check className="h-3 w-3 stroke-[3px]" />
        )}
    </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }






