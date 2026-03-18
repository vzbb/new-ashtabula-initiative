"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

const stepperVariants = cva("flex items-center", {
  variants: {
    orientation: {
      horizontal: "flex-row gap-2",
      vertical: "flex-col gap-4",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
  currentStep: number
  steps: {
    label: string
    description?: string
  }[]
}

function Stepper({
  className,
  orientation = "horizontal",
  currentStep,
  steps,
  ...props
}: StepperProps) {
  return (
    <div
      className={cn(stepperVariants({ orientation }), className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex items-center gap-3",
                orientation === "vertical" && "w-full"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isCurrent &&
                    "border-primary bg-background text-primary",
                  !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className={cn(orientation === "horizontal" && "hidden sm:block")}>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                    isCompleted && "text-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex shrink-0 transition-colors",
                  orientation === "horizontal"
                    ? "h-[2px] flex-1 bg-muted"
                    : "w-[2px] flex-1 bg-muted self-stretch",
                  index < currentStep && "bg-primary"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export { Stepper, stepperVariants }
export type { StepperProps }
