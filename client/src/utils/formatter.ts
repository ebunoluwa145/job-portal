// utils/formatters.ts

export const formatRecency = (dateValue: string | number | Date | undefined): string => {
  if (!dateValue) return 'Unknown date';

  const now = new Date();
  const created = new Date(dateValue);
  
  // Handle invalid date strings
  if (isNaN(created.getTime())) return 'Invalid date';

  const diffInMs = now.getTime() - created.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Robust breakdown
  if (diffInSeconds < 60) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // Fallback to absolute date for older posts
  return created.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: created.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
};