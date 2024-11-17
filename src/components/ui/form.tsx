import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { RegisterOptions } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type: string;
  errorMessage?: string;
  register: any;
  name: string;
  validationOptions?: RegisterOptions;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  errorMessage,
  register,
  name,
  validationOptions,
  className,
}) => (
  <div className={cn("w-full", className)}>
    <h3 className="mb-1">{label}</h3>
    <input
      type={type}
      className="border border-black rounded-sm p-1 px-2 w-full"
      {...register(name, validationOptions)}
    />
    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
  </div>
);

interface FormProps {
  children: React.ReactNode;
  className?: string;
}

export const Form: React.FC<FormProps> = ({ children, className }: FormProps) => (
  <form
    className={cn(
      "pointer-events-auto font-mono flex flex-col items-center w-full gap-5",
      className
    )}
  >
    {children}
  </form>
);

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
  rootMessage?: string;
  rootType?: "error" | "success";
  onClose?: () => void;
  containerLess?: boolean;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  onClose,
  rootMessage: rootMessage,
  rootType = "error",
  containerLess = false,
}) => (
  <div className={cn(!containerLess && "bg-white/90 w-full h-full p-5 rounded-md border relative")}>
    {title && <h2 className="text-center font-semibold font-mono text-3xl mb-2">{title}</h2>}
    {onClose && (
      <X
        onClick={onClose}
        className="absolute top-2 right-2 opacity-50 size-5 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
      />
    )}
    {rootMessage && (
      <pre
        className={cn(
          "font-mono rounded-md py-2 border text-left px-2 mb-4",
          rootType == "error" && "text-red-800 bg-red-100",
          rootType == "success" && "text-green-800 bg-green-100"
        )}
      >
        {rootMessage}
      </pre>
    )}
    {children}
  </div>
);
