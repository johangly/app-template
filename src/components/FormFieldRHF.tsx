import * as React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  description?: string;
}

export function FormField({
  name,
  label,
  description,
  className,
  ...props
}: FormFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            {...props}
            id={name}
            className={cn(
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
          />
        )}
      />
      {description && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}