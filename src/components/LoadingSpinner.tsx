export default function LoadingSpinner() {
	return (
		<div className="flex justify-center items-center h-full">
			<div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 border-solid border-opacity-75"></div>
		</div>
	);
}
