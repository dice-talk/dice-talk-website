// import React from 'react';

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    isFuture?: boolean;
  };
  stroke?: string;
}

export default function CustomDot({ cx, cy, payload, stroke = '#3B82F6' }: CustomDotProps) {
  if (payload?.isFuture) return null;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="white"
      stroke={stroke}
      strokeWidth={2}
    />
  );
}