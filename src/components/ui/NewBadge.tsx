import React from 'react';

interface NewBadgeProps {
  createdAt: string;
}

const isWithinLastThreeDays = (dateString: string): boolean => {
  const qnaDate = new Date(dateString);
  const today = new Date();

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfThreeDaysAgo = new Date(startOfToday);
  startOfThreeDaysAgo.setDate(startOfToday.getDate() - 2);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  return qnaDate >= startOfThreeDaysAgo && qnaDate < startOfTomorrow;
};

export const NewBadge: React.FC<NewBadgeProps> = ({ createdAt }) => {
  if (!isWithinLastThreeDays(createdAt)) {
    return null;
  }

  return <span className="text-xs font-semibold text-amber-600 mr-2 bg-amber-100 px-1.5 py-0.5 rounded-full">NEW</span>;
};