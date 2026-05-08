import { Label } from './ui/label';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

interface FormSelectNativeOption {
    value: string;
    label: string;
}

interface FormSelectNativeProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: FormSelectNativeOption[];
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export default function FormSelectNative({
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Seleccione una opción',
    error,
    className,
    disabled = false,
}: FormSelectNativeProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </Label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        'w-full h-10 px-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    )}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
