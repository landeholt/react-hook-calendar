import React, { CSSProperties, ReactNode } from 'react';
import { useCalendar } from '../hooks/useCalendar';

type GridLength = '30 min' | '1 hour' | '2 hours' | '4 hours' | '1 day';

export type CalendarGridProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  length?: GridLength;
};

function gridLengthToQuaterHours(length: GridLength) {
  return {
    '30 min': 2,
    '1 hour': 4,
    '2 hours': 8,
    '4 hours': 16,
    '1 day': 1,
  }[length];
}

export function CalendarGrid({
  children,
  className,
  style,
  length = '2 hours',
}: CalendarGridProps) {
  const { view, viewTimes, daysInGrid } = useCalendar();
  const numDaysDisplayed = view === 'day' ? 1 : view === 'week' ? 7 : 7;
  const quaterHours = gridLengthToQuaterHours(length);
  const numRowsDisplayed =
    view === 'month' ? 6 : (viewTimes.end - viewTimes.start) / (15 * 60 * 1000) / quaterHours;

  return (
    <>
      {Array.apply(null, Array(numDaysDisplayed)).flatMap((_, dayIndex) =>
        Array.apply(null, Array(numRowsDisplayed)).map((_, timeIndex) => {
          const gridRowStart = timeIndex * quaterHours + 1;
          const gridRowEnd = gridRowStart + quaterHours;
          const gridColumnStart = dayIndex + 1;
          return (
            <div
              className={className}
              style={{
                gridRowStart,
                gridRowEnd,
                gridColumnStart,
                gridColumnEnd: gridColumnStart,
                ...style,
              }}
            >
              {view === 'month' && daysInGrid[timeIndex * 7 + dayIndex]}
              {children}
            </div>
          );
        })
      )}
    </>
  );
}
