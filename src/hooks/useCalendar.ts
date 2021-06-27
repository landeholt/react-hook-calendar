import { endOfWeek, Interval, startOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useContext, createContext } from 'react';
import { CalendarView } from '../types';

export type CalendarContextType = {
  /** The view that the calendar is currently displaying */
  date: Date;
  view: CalendarView;
  viewPeriod: Interval;
  viewTimes: { start: number; end: number };
  // Controls
  setDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
  goForward: () => void;
  goBackward: () => void;
  getDayForGrid: (i: number) => number;
  daysFromLastMonth: number;
};

const getViewPeriod = (view: CalendarView) => {
  const startPeriod = view === 'week' ? startOfWeek : startOfMonth;
  const endPeriod = view === 'week' ? endOfWeek : endOfMonth;
  return { start: startPeriod(new Date()), end: endPeriod(new Date()) };
};

export const CalendarContext = createContext<CalendarContextType>({
  date: new Date(),
  view: 'month',
  viewPeriod: getViewPeriod('month'),
  viewTimes: { start: 0, end: 24 * 60 * 60 * 1000 },
  setView: () => {},
  setDate: () => {},
  weekStartsOn: 0,
  goForward: () => {},
  goBackward: () => {},
  getDayForGrid: () => 0,
  daysFromLastMonth: 0,
});

/**
 * This hook can be used to connect to the calendar context and render content based on the context.
 * The context contains various information about the calendar state.
 *
 * @returns The calendar context
 */
export function useCalendar(): CalendarContextType {
  return useContext(CalendarContext);
}
