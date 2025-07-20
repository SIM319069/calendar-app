import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format, parseISO } from 'date-fns';
import { IEvent } from '../../types';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

interface CalendarComponentProps {
  events: IEvent[];
  onDateSelect: (date: Date) => void;
  onEventSelect: (event: IEvent) => void;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  onDateSelect,
  onEventSelect,
}) => {
  const [value, setValue] = useState<Date>(new Date());

  const tileContent = ({ date }: { date: Date }) => {
    const dayEvents = events.filter((event) => {
      const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
      return format(eventDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });

    if (dayEvents.length > 0) {
      return (
        <div className="event-indicators">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`event-dot priority-${event.priority}`}
              title={event.title}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDateChange = (value: Date | [Date, Date] | null) => {
    if (value instanceof Date) {
      setValue(value);
      onDateSelect(value);
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      setValue(value[0]);
      onDateSelect(value[0]);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={value}
        tileContent={tileContent}
        className="custom-calendar"
      />
      <div className="selected-date-events">
        <h3>Events on {format(value, 'MMMM d, yyyy')}</h3>
        {events
          .filter((event) => {
            const eventDate = typeof event.date === 'string' ? parseISO(event.date) : event.date;
            return format(eventDate, 'yyyy-MM-dd') === format(value, 'yyyy-MM-dd');
          })
          .map((event) => (
            <div
              key={event.id}
              className={`event-item priority-${event.priority}`}
              onClick={() => onEventSelect(event)}
            >
              <div className="event-time">
                {event.startTime} - {event.endTime}
              </div>
              <div className="event-title">{event.title}</div>
              {event.description && (
                <div className="event-description">{event.description}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};