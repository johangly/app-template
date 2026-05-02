import React from 'react';
import { cn } from '../lib/utils';
import {
  useResponsiveGridColumns,
  type ResponsiveGridColumnsOptions,
} from '../hooks/useResponsiveGridColumns';

export type ResponsiveGridProps = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
} & ResponsiveGridColumnsOptions;

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  className,
  children,
  style,
  minItemWidth,
  gapPx,
  maxCols,
  avoidCols,
  measureParent,
  initialCols,
}) => {
  const { ref, style: responsiveStyle } = useResponsiveGridColumns<HTMLDivElement>({
    minItemWidth,
    gapPx,
    maxCols,
    avoidCols,
    measureParent,
    initialCols,
  });

  return (
    <div
      ref={ref}
      className={cn('grid w-full', className)}
      style={{ ...responsiveStyle, ...style }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid;
