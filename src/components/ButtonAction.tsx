import { type FunctionComponent, type JSX } from "react";
import clsx from "clsx";

type IconType = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

interface ButtonActionProps {
  title: string;
  icon: IconType;
  className?: string;
  isActive?: boolean;
  onClick?: () => void; // khai báo kiểu cho onClick
}

export const ButtonAction: FunctionComponent<ButtonActionProps> = ({
  title,
  icon: Icon,
  className,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 cursor-pointer",
        "text-sm font-medium text-gray-700",
        isActive && "border border-gray-300",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </button>
  );
};
