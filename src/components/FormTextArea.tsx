import { Label } from './ui/label';
import { cn } from '../lib/utils';

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export default function FormTextArea({ label, error, className, id, ...props }: FormTextAreaProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </Label>
            <textarea
                id={id}
                className={cn(
                    'flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-900 dark:placeholder:text-gray-500 resize-none',
                    error && 'border-destructive focus-visible:ring-destructive',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
