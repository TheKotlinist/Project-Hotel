// components/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
        <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
        </div>
    );
}
