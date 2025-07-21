import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { format, parseISO } from 'date-fns';
import { IEvent } from '../../types';
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
  const calendarRef = useRef<FullCalendar>(null);
  const [currentView, setCurrentView] = useState('dayGridMonth');

  // Convert our events to FullCalendar format
  const calendarEvents = events.map(event => {
    const eventDate = typeof event.date === 'string' ? event.date : format(event.date, 'yyyy-MM-dd');
    
    return {
      id: event.id?.toString(),
      title: event.title,
      start: `${eventDate}T${event.startTime}`,
      end: `${eventDate}T${event.endTime}`,
      backgroundColor: getEventColor(event.priority),
      borderColor: getEventColor(event.priority),
      extendedProps: {
        description: event.description,
        priority: event.priority,
        originalEvent: event
      }
    };
  });

  function getEventColor(priority: string): string {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#2196f3';
    }
  }

  const handleDateClick = (arg: any) => {
    onDateSelect(arg.date);
  };

  const handleEventClick = (clickInfo: any) => {
    const originalEvent = clickInfo.event.extendedProps.originalEvent;
    onEventSelect(originalEvent);
  };

  const renderEventContent = (eventContent: any) => {
    return (
      <div className="fc-event-content">
        <div className="fc-event-time">{eventContent.timeText}</div>
        <div className="fc-event-title">{eventContent.event.title}</div>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="view-buttons">
          <button 
            className={currentView === 'dayGridMonth' ? 'active' : ''}
            onClick={() => {
              setCurrentView('dayGridMonth');
              calendarRef.current?.getApi().changeView('dayGridMonth');
            }}
          >
            Month
          </button>
          <button 
            className={currentView === 'timeGridWeek' ? 'active' : ''}
            onClick={() => {
              setCurrentView('timeGridWeek');
              calendarRef.current?.getApi().changeView('timeGridWeek');
            }}
          >
            Week
          </button>
          <button 
            className={currentView === 'timeGridDay' ? 'active' : ''}
            onClick={() => {
              setCurrentView('timeGridDay');
              calendarRef.current?.getApi().changeView('timeGridDay');
            }}
          >
            Day
          </button>
          <button 
            className={currentView === 'listWeek' ? 'active' : ''}
            onClick={() => {
              setCurrentView('listWeek');
              calendarRef.current?.getApi().changeView('listWeek');
            }}
          >
            List
          </button>
        </div>
      </div>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={calendarEvents}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        eventDisplay="block"
        dayMaxEvents={3}
        moreLinkClick="popover"
        weekends={true}
        nowIndicator={true}
        editable={false}
        selectable={true}
        selectMirror={true}
        eventClassNames={(arg) => {
          return [`priority-${arg.event.extendedProps.priority}`];
        }}
      />
      
      <div className="calendar-legend">
        <h4>Priority Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color high"></span>
            <span>High Priority</span>
          </div>
          <div className="legend-item">
            <span className="legend-color medium"></span>
            <span>Medium Priority</span>
          </div>
          <div className="legend-item">
            <span className="legend-color low"></span>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
    </div>
  );
};