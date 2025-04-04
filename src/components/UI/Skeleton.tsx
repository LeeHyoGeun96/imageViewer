interface SkeletonProps {
  className?: string;
  spinnerSize?: 4 | 8 | 12 | 16 | 20 | 24;
}

export const Skeleton = ({ className, spinnerSize = 16 }: SkeletonProps) => {
  const sizeClasses = {
    4: "size-4",
    8: "size-8",
    12: "size-12",
    16: "size-16",
    20: "size-20",
    24: "size-24",
  };
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <div className="flex items-center justify-center animate-pulse w-full h-full bg-gray-300">
        <svg
          className={`mr-3 ${sizeClasses[spinnerSize]} animate-spin `}
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );
};
