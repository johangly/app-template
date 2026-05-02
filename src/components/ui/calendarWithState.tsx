import React, { useState, useEffect } from 'react';
import { DayPickerSingleProps } from 'react-day-picker';
import { Calendar } from './calendar';

export const CalendarWithState: React.FC<DayPickerSingleProps> = ({ selected, ...props }) => {
  const [displayMonth, setDisplayMonth] = useState<Date | undefined>(selected || undefined);

  useEffect(() => {
    if (selected) {
      setDisplayMonth(selected);
    }
  }, [selected]);

  return (
    <Calendar
      {...props}
      mode="single"
      selected={selected}
      month={displayMonth}
      onMonthChange={setDisplayMonth}
    />
  );
};
