import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

type CalendarProps = React.ComponentProps<typeof DayPicker>;

/**
 * Wraps react-day-picker with the shadcn Calendar pattern.
 * Layout comes from react-day-picker's own style.css (native table grid);
 * we only re-tint the accent and typography so it matches the blue theme.
 */
function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 [--rdp-accent-color:#2563eb] [--rdp-accent-background-color:#2563eb]', className)}
      classNames={{
        caption_label: 'text-sm font-semibold text-slate-900',
        weekday: 'text-slate-400 font-medium uppercase text-[10px]',
        day: 'hover:bg-blue-50 hover:text-blue-700 rounded-lg',
        day_selected: '!bg-blue-600 !text-white hover:!bg-blue-700',
        day_today:
          '[&:not([data-selected])]:font-bold [&:not([data-selected])]:text-blue-700',
        day_outside: 'text-slate-300 opacity-60',
        day_disabled: 'text-slate-300 opacity-40',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="size-4 text-slate-500" />
          ) : (
            <ChevronRight className="size-4 text-slate-500" />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar, type CalendarProps };