interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl"; // Restricting size to specific values
}

const Loader = ({ size = "md" }: LoaderProps) => {
  // Define size mappings
  const sizeMap: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "w-4 h-4 border-2", // Small
    md: "w-8 h-8 border-4", // Medium (default)
    lg: "w-12 h-12 border-4", // Large
    xl: "w-16 h-16 border-4", // Extra Large
  };
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeMap[size]} border-gray-300 rounded-full animate-spin`}
        style={{ borderTopColor: "#b92825" }} // Custom red color
      ></div>
    </div>
  );
};

export default Loader;
