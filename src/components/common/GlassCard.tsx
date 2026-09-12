import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'green' | 'red' | 'amber' | 'blue' | 'purple';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  onClick
}) => {
  let variantClass = 'liquid-glass';
  if (variant === 'glow') variantClass = 'liquid-glass-glow';
  else if (variant === 'green') variantClass = 'liquid-glass-green';
  else if (variant === 'red') variantClass = 'liquid-glass-red';
  else if (variant === 'amber') variantClass = 'liquid-glass-amber';
  else if (variant === 'blue') variantClass = 'liquid-glass-blue';
  else if (variant === 'purple') variantClass = 'liquid-glass-purple';

  const hoverClass = hoverEffect ? 'liquid-glass-card cursor-pointer' : '';

  return (
    <div 
      className={`rounded-2xl p-5 ${variantClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
