import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// helper: strip time portion for date-only comparisons
const stripTime = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

interface DatePickerProps {
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [month, setMonth] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setDate(value);
    setMonth(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
            disabled={disabled}
          >
            {date ? date.toLocaleDateString("en-GB") : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            // disable days before minDate or after maxDate
            disabled={(day: Date) =>
              (minDate ? stripTime(day) < stripTime(minDate) : false) ||
              (maxDate ? stripTime(day) > stripTime(maxDate) : false)
            }
            onSelect={(d) => {
              // Calendar returns Date | undefined
              setDate(d);
              setOpen(false);
              if (onChange) onChange(d);
            }}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
