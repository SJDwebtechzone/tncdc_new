import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
    <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        ref={ref}
        className={cn(
            "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-[#0f172a] data-[state=unchecked]:bg-slate-200",
            props.checked ? "data-[state=checked]" : "data-[state=unchecked]",
            className
        )}
        onClick={() => props.onCheckedChange?.(!props.checked)}
        {...props}
    >
        <span
            className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            )}
            data-state={props.checked ? "checked" : "unchecked"}
        />
    </button>
))
Switch.displayName = "Switch"

export { Switch }






