import { forwardRef } from "react";

import { cn } from "../lib/utils";
import { Button, type ButtonProps } from "./ui/button";

type AppButtonIntent = "primary" | "danger" | "outline";

export type AppButtonProps = ButtonProps & {
	intent?: AppButtonIntent;
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
	({ intent = "primary", className, variant, ...props }, ref) => {
		const intentClassName =
			intent === "primary"
				? "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-base min-h-[42px] cursor-pointer"
				: intent === "danger"
				? "bg-red-600 text-white hover:bg-red-500 cursor-pointer"
				: "bg-gray-100/30 hover:bg-gray-100 cursor-pointer";

		const computedVariant =
			variant ?? (intent === "outline" ? "outline" : "default");

		return (
			<Button
				ref={ref}
				variant={computedVariant}
				className={cn(intentClassName, className)}
				{...props}
			/>
		);
	}
);

AppButton.displayName = "AppButton";
