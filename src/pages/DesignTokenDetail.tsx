
import React from 'react';
import { useParams } from 'react-router-dom';
import { DesignTokens } from '@/components/documentation/DesignTokens';

const DesignTokenDetail: React.FC = () => {
  const { tokenName } = useParams<{ tokenName: string }>();
  
  if (!tokenName) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Design token not found</p>
      </div>
    );
  }

  // Convert URL parameter to display name
  const displayName = tokenName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Use the comprehensive DesignTokens component for all token types
  return <DesignTokens activeToken={displayName} />;
};

export default DesignTokenDetail;
