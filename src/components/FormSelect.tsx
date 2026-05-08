import { useState, useEffect } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cn } from '../lib/utils';

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    options: FormSelectOption[];
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export default function FormSelect({
    label,
    value,
    onValueChange,
    options,
    placeholder = 'Seleccione una opción',
    error,
    className,
    disabled = false,
}: FormSelectProps) {
    const [internalValue, setInternalValue] = useState(value);
    
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    const handleChange = (val: string) => {
        setInternalValue(val);
        onValueChange(val);
    };

    const selectedLabel = options.find(o => String(o.value) === String(internalValue))?.label;

    return (
        <div className={cn('space-y-2', className)}>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </Label>
            <Select value={internalValue} onValueChange={handleChange} disabled={disabled}>
                <SelectTrigger 
                    className={cn(
                        'w-full',
                        error && 'border-red-500'
                    )}
                >
                    <SelectValue placeholder={placeholder}>
                        {selectedLabel || placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
