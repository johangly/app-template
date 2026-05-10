import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import { Input } from "./input"
import { Button } from "./button"

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  placeholder?: string
}

export function NumberInput({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  className,
  placeholder,
}: NumberInputProps) {
  const [internalValue, setInternalValue] = React.useState<number>(
    defaultValue ?? min
  )
  
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const updateValue = (newValue: number) => {
    // Clamp value between min and max
    const clampedValue = Math.min(Math.max(newValue, min), max)
    
    if (!isControlled) {
      setInternalValue(clampedValue)
    }
    
    onChange?.(clampedValue)
  }

  const increment = () => {
    updateValue(currentValue + step)
  }

  const decrement = () => {
    updateValue(currentValue - step)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue)) {
      updateValue(newValue)
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md border border-input bg-background p-1",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        "dark:bg-gray-800 dark:border-gray-700",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 rounded-sm dark:hover:bg-gray-700 dark:text-gray-300"
        onClick={decrement}
        disabled={disabled || currentValue <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      
      <Input
        type="number"
        value={currentValue}
        onChange={handleInputChange}
        disabled={disabled}
        placeholder={placeholder}
        className="h-7 w-16 border-0 bg-transparent p-0 text-center text-sm font-medium shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
        step={step}
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 rounded-sm dark:hover:bg-gray-700 dark:text-gray-300"
        onClick={increment}
        disabled={disabled || currentValue >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}