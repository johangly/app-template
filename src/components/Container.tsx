import React from 'react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ContainerProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  description?: string;
};

const Container: React.FC<ContainerProps> = ({ 
  children, 
  className = '', 
  style,
  title,
  description 
}) => (
  <div className={twMerge('min-h-screen w-full p-6 bg-slate-50', className)} style={style}>
    <div className="max-w-7xl mx-auto space-y-6">
      {(title || description) && (
        <div className="flex flex-col space-y-1.5">
          {title && <h2 className="text-2xl font-bold leading-none tracking-tight text-slate-900">{title}</h2>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        {children}
      </div>
    </div>
  </div>
);

export default Container;