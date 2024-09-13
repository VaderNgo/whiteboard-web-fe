import { X } from "lucide-react";
import { RegisterOptions } from "react-hook-form";

interface InputFieldProps {
  label: string;
  type: string;
  errorMessage?: string;
  register: any;
  name: string;
  validationOptions?: RegisterOptions;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  errorMessage,
  register,
  name,
  validationOptions,
}) => (
  <div className="w-full">
    <h3 className="font-medium">{label}</h3>
    <input
      type={type}
      className="border border-black rounded-sm p-2 w-full"
      {...register(name, validationOptions)}
    />
    {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
  </div>
);

interface FormProps {
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ children }) => (
  <form className="pointer-events-auto font-mono flex flex-col items-center w-full gap-5">
    {children}
  </form>
);

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  rootError?: string;
  onClose: () => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  title,
  onClose,
  rootError,
}) => (
  <div className="bg-white/90 w-full h-full p-5 rounded-md border relative">
    <h2 className="text-center font-semibold font-mono text-3xl mb-2">{title}</h2>
    <X
      onClick={onClose}
      className="absolute top-2 right-2 opacity-50 size-5 hover:opacity-100 transition-opacity cursor-pointer pointer-events-auto"
    />
    {rootError && (
      <p className="font-mono rounded-md py-2 text-red-800 bg-red-100 border text-center my-4">
        {rootError}
      </p>
    )}
    {children}
  </div>
);
