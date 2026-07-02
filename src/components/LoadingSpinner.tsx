import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
    </div>
  );
};

export default LoadingSpinner;
