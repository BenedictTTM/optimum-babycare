import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label?: string;
  type?: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  children?: React.ReactNode;
}

export function FormInput({ 
  type = 'text', 
  placeholder, 
  register, 
  error, 
  children 
}: FormInputProps) {
  return (
    <div>
      <input
        type={type}
        {...register}
        className="w-full text-gray-500 py-1 border-0 border-b border-gray-500 bg-transparent focus:outline-none focus:border-gray-500"
        placeholder={placeholder}
      />
      <div className="min-h-[1rem]">
        {error && (
          <p className="text-amber-500 text-xs transition-opacity duration-300 ease-in-out">
            {error}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}