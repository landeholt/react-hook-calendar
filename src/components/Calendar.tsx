import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  getDay,
  getDaysInMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
} from 'date-fns';
import {
  addDays,
  addWeeks,
  subDays as subDaysFP,
  subWeeks,
  addMonths,
  subMonths,
} from 'date-fns/fp';
import React, { useState, ReactNode, useCallback, useMemo } from 'react';
import { CalendarContext } from '../hooks/useCalendar';
import { CalendarView } from '../types';
import { parseTime, range, toDate } from '../util';

export type CalendarProps = {
  /** The view that the calendar should use. This can be changed with */
  defaultView?: CalendarView;
  /** A date that should be shown at the start. Defaults to today. */
  initialDate?: Date | string | number;
  /** All the elements within the calendar that might consume the calendar context. */
  children?: ReactNode;
  /** Limit the view to appointments after this time */
  timeStart?: string;
  /** Limit the view to appointments before this time */
  timeEnd?: string;
  /** Configure the day, that the week should start on */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
};
/**
 * Manages the calendar state and provides the calendar context.
 */
export function Calendar({
  defaultView = 'month',
  initialDate = new Date(),
  timeStart = '0:00',
  timeEnd = '24:00',
  weekStartsOn,
  children,
}: CalendarProps) {
  // The focus date is the date that is currently shown
  const [focusDate, setFocusDate] = useState(toDate(initialDate));
  // Stores the current view
  const [view, setView] = useState(defaultView);

  // The view period reacts to changes in view and focus date
  const viewPeriod = useMemo(
    () => ({
      start: getViewPeriodStart(view, focusDate, weekStartsOn),
      end: getViewPeriodEnd(view, focusDate, weekStartsOn),
    }),
    [view, focusDate]
  );

  const viewTimes = useMemo(() => ({ start: parseTime(timeStart), end: parseTime(timeEnd) }), [
    timeStart,
    timeEnd,
  ]);

  const goForward = useCallback(
    () => setFocusDate(view === 'day' ? addDays(1) : view === 'week' ? addWeeks(1) : addMonths(1)),
    [view]
  );

  const goBackward = useCallback(
    () =>
      setFocusDate(view === 'day' ? subDaysFP(1) : view === 'week' ? subWeeks(1) : subMonths(1)),
    [view]
  );

  const firstDateOnMonth = startOfMonth(toDate(focusDate));
  const firstDayOnMonth = getDay(firstDateOnMonth);
  //const startWeekOn = weekStartsOn === undefined ? 0 : (weekStartsOn as number);
  // Number of days that we need to get from the previous month
  const daysFromLastMonth = ((i: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (i === 0) {
      return 7;
    }
    return i - 1;
  })(firstDayOnMonth);
  const lastMonthInDays = getDaysInMonth(subDays(firstDateOnMonth, 1));
  const monthInDays = getDaysInMonth(firstDateOnMonth);

  const daysInGrid = [
    ...Array(daysFromLastMonth)
      .fill(lastMonthInDays)
      .map((i, j) => i - daysFromLastMonth + j + 1),
    ...range(monthInDays),
    ...range(42 - daysFromLastMonth - monthInDays),
  ];

  return (
    <CalendarContext.Provider
      value={{
        view,
        setView,
        date: focusDate,
        setDate: setFocusDate,
        viewPeriod,
        goForward,
        goBackward,
        viewTimes,
        weekStartsOn,
        daysInGrid,
        daysFromLastMonth,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

function getViewPeriodStart(
  view: CalendarView,
  referenceDate: Date,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
): Date {
  if (view === 'month') {
    return startOfMonth(referenceDate);
  }
  if (view === 'week') {
    return startOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day') {
    return startOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}

function getViewPeriodEnd(
  view: CalendarView,
  referenceDate: Date,
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
): Date {
  if (view === 'month') {
    return endOfMonth(referenceDate);
  }
  if (view === 'week') {
    return endOfWeek(referenceDate, { weekStartsOn });
  }
  if (view === 'day') {
    return endOfDay(referenceDate);
  }
  throw new Error('Unknown view value `' + view + '`.');
}
