import * as React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { CalendarDays, X } from 'lucide-react';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '../../lib/utils';

const DATE_FMT = 'yyyy-MM-dd';

function toCivil(d: Date | undefined): string {
  if (!d) return '';
  // Treat as civil date locally; avoid UTC off-by-one
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function fromCivil(str?: string): Date | undefined {
  if (!str) return undefined;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function formatDisplay(str?: string): string {
  if (!str) return '';
  const d = fromCivil(str);
  return d ? format(d, 'EEE, dd MMM yyyy', { locale: id }) : str;
}

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
  disabled?: (date: Date) => boolean;
}

export function DateField({ value, onChange, placeholder = 'Pilih tanggal', className, align = 'start', disabled }: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const selected = fromCivil(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start gap-2 font-normal',
            !value && 'text-slate-400',
            className
          )}
        >
          <CalendarDays className="size-4 text-blue-600 shrink-0" />
          <span className="flex-1 text-left truncate text-slate-700">
            {value ? formatDisplay(value) : placeholder}
          </span>
          {value && (
            <span
              className="size-4 rounded-full text-slate-400 hover:text-rose-500 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
            >
              <X className="size-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            onChange(toCivil(d));
            setOpen(false);
          }}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangeFieldProps {
  startValue: string;
  endValue: string;
  onChange: (start: string, end: string) => void;
  placeholder?: string;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function DateRangeField({ startValue, endValue, onChange, placeholder = 'Pilih rentang tanggal', className, align = 'start' }: DateRangeFieldProps) {
  const [open, setOpen] = React.useState(false);
  const range = {
    from: fromCivil(startValue) || undefined,
    to: fromCivil(endValue) || undefined,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-start gap-2 font-normal',
            !startValue && !endValue && 'text-slate-400',
            className
          )}
        >
          <CalendarDays className="size-4 text-blue-600 shrink-0" />
          <span className="flex-1 truncate text-slate-700">
            {startValue && endValue
              ? `${formatDisplay(startValue)} – ${formatDisplay(endValue)}`
              : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="range"
          defaultMonth={range.from}
          selected={{ from: range.from as any, to: range.to as any }}
          onSelect={(r: any) => {
            onChange(
              toCivil(r?.from),
              r?.to && r.to.getTime() !== r.from?.getTime() ? toCivil(r.to) : toCivil(r.from)
            );
          }}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}