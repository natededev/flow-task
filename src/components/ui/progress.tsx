import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>((props, ref) => {
  const { className, value, ...rest } = props;
  // Extract aria-label and aria-labelledby for accessibility
  const restObj = rest as Record<string, unknown>;
  const ariaLabel = restObj["aria-label"] as string | undefined;
  const ariaLabelledBy = restObj["aria-labelledby"] as string | undefined;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      aria-label={ariaLabel || (!ariaLabelledBy ? "Progress" : undefined)}
      aria-labelledby={ariaLabelledBy}
      {...rest}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
