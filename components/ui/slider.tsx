"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  const currentValue = _values[0] ?? 0;

  const getColorClass = (val: number) => {
    if (val < 4) return "bg-[#DE392E]";
    if (val < 7) return "bg-[#FF9315]";
    return "bg-[#15FFAB]";
  };

  const dynamicColor = getColorClass(currentValue);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col border border-[#454587] bg-[#252545] rounded-lg",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow rounded-full",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full",
          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            dynamicColor
          )}
          style={{
            boxShadow: `${
              currentValue < 4
                ? "0 -4px 6px -2px #DE392E, 0 4px 6px -2px #DE392E"
                : currentValue < 7
                ? "0 -4px 6px -2px #FF9315, 0 4px 6px -2px #FF9315"
                : "0 -4px 6px -2px #15FFAB, 0 4px 6px -2px #15FFAB"
            }`,
            borderRadius: "9999px",
          }}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 bg-[#252545] border-[#454587]",
            "border-white"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
