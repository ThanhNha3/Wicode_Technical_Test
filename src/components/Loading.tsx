export default function Loading({
  text = "Loading...",
  fullscreen = false,
}: {
  text?: string;
  fullscreen?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullscreen
          ? "fixed inset-0 bg-black/30 z-50"
          : "w-full h-full bg-transparent"
      }`}
    >
      <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-500 border-l-gray-200 border-r-gray-200 rounded-full animate-spin" />
      <span className="text-gray-700 dark:text-gray-200 font-medium text-lg">
        {text}
      </span>
    </div>
  );
}
