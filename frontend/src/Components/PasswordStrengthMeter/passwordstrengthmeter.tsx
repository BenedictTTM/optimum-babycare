import React from 'react';
import zxcvbn from 'zxcvbn';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const strength = zxcvbn(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  
  // Create 5 segments with appropriate colors
  const getSegmentColor = (index: number) => {
    if (index <= strength.score) {
      switch (strength.score) {
        case 0: return 'bg-amber-600';
        case 1: return 'bg-red-400';
        case 2: return 'bg-yellow-400';
        case 3: return 'bg-blue-400';
        case 4: return 'bg-green-500';
        default: return 'bg-gray-200';
      }
    }
    return 'bg-gray-200';
  };

  return (
    <div className="mt-1">
      {/* Segmented progress bar */}
      <div className="flex gap-1 h-1 w-full">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`flex-1 rounded-sm ${getSegmentColor(index)}`}
          />
        ))}
      </div>
      
      {/* Compact strength label */}
      <p className="text-xs mt-1 text-gray-500 h-4">
        {strengthLabels[strength.score]}
      </p>
    </div>
  );
}