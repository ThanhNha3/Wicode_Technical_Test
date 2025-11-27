import { Exclamation } from "../icons";

const SystemError = ({
  title = "Hệ thống đang bảo trì",
  message = "Xin lỗi vì sự bất tiện này. Vui lòng thử lại sau.",
}) => {
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <Exclamation className="w-32 h-32 md:w-40 md:h-40 text-red-700 mb-6" />
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
        {message}
      </p>
    </div>
  );
};

export default SystemError;
