import React from 'react';


interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export function SubmitButton({ isSubmitting, children, loadingText = 'Loading...' }: SubmitButtonProps) {
  return (
    <>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-500 text-white py-2 px-4 rounded-sm hover:bg-amber-800 disabled:opacity-50"
      >
        {isSubmitting ? loadingText : children}
      </button>
    </>
  );
}

