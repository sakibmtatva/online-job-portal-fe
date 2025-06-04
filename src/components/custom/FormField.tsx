import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  touched?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactNode;
}

export const FormField = ({
  id,
  label,
  error,
  touched,
  type = "text",
  placeholder,
  className = "",
  value,
  onChange,
  leftIcon,
}: FormFieldProps) => {
  return (
    <div className="w-full">
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        <Input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className={`${leftIcon ? "pl-10" : ""} ${
            error && touched ? "border-red-500" : ""
          } ${className}`}
          onChange={onChange}
          value={value}
        />
      </div>
      {error && touched && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};
