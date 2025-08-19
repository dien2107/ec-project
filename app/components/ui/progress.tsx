import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "~/libs/utils";
import type { ProgressProps } from "~/types/progress.schema";

function Progress({
  className,
  value,
  trackColor = "bg-primary/20",
  fillColor = "bg-primary",
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        trackColor,
        "relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          fillColor,
          "h-full w-full flex-1 transition-all rounded-full"
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
