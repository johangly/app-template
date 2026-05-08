import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function FormField({ label, error, className, id, ...props }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </Label>
            <input
                id={id}
                className={cn(
                    'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    'dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900 dark:placeholder:text-gray-500',
                    error && 'border-destructive focus-visible:ring-destructive',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
