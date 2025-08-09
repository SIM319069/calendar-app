import React, { useState, useEffect } from 'react';
import { CalendarComponent } from './components/Calendar';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { FilterPanel } from './components/FilterPanel';
import { IEvent, IEventFilters } from './types';
import { eventApi } from './services/api';
import { parseISO, isAfter, isBefore, isEqual, startOfDay } from 'date-fns';
import './App.css';

function App() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersPanelExpanded, setFiltersPanelExpanded] = useState(false);
  
  const [filters, setFilters] = useState<IEventFilters>({
    searchText: '',
    priorities: {
      low: true,
      medium: true,
      high: true,
    },
    dateRange: {
      start: null,
      end: null,
    },
    showPastEvents: false,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventApi.getAll();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];
    const today = startOfDay(new Date());

    // Filter by search text
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(searchLower) ||
          (event.description && event.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by priority
    filtered = filtered.filter(event => filters.priorities[event.priority]);

    // Filter by date range
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(event => {
        const eventDate = typeof event.date === 'string' 
          ? startOfDay(parseISO(event.date)) 
          : startOfDay(event.date);

        if (filters.dateRange.start && filters.dateRange.end) {
          return (
            (isAfter(eventDate, startOfDay(filters.dateRange.start)) || 
             isEqual(eventDate, startOfDay(filters.dateRange.start))) &&
            (isBefore(eventDate, startOfDay(filters.dateRange.end)) || 
             isEqual(eventDate, startOfDay(filters.dateRange.end)))
          );
        } else if (filters.dateRange.start) {
          return isAfter(eventDate, startOfDay(filters.dateRange.start)) || 
                 isEqual(eventDate, startOfDay(filters.dateRange.start));
        } else if (filters.dateRange.end) {
          return isBefore(eventDate, startOfDay(filters.dateRange.end)) || 
                 isEqual(eventDate, startOfDay(filters.dateRange.end));
        }
        return true;
      });
    }

    // Filter past events
    if (!filters.showPastEvents) {
      filtered = filtered.filter(event => {
        const eventDate = typeof event.date === 'string' 
          ? startOfDay(parseISO(event.date)) 
          : startOfDay(event.date);
        return isAfter(eventDate, today) || isEqual(eventDate, today);
      });
    }

    setFilteredEvents(filtered);
  };

  const handleCreateEvent = async (eventData: Omit<IEvent, 'id'>) => {
    try {
      const newEvent = await eventApi.create(eventData);
      setEvents([...events, newEvent]);
      setShowForm(false);
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to create event');
      console.error(err);
    }
  };

  const handleUpdateEvent = async (eventData: Omit<IEvent, 'id'>) => {
    if (!selectedEvent?.id) return;

    try {
      const updatedEvent = await eventApi.update(selectedEvent.id, eventData);
      setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
      setShowForm(false);
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to update event');
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventApi.delete(id);
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowForm(true);
  };

  const handleEventSelect = (event: IEvent) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleFormSubmit = (eventData: Omit<IEvent, 'id'>) => {
    if (selectedEvent) {
      handleUpdateEvent(eventData);
    } else {
      handleCreateEvent(eventData);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleClearFilters = () => {
    setFilters({
      searchText: '',
      priorities: {
        low: true,
        medium: true,
        high: true,
      },
      dateRange: {
        start: null,
        end: null,
      },
      showPastEvents: false,
    });
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Calendar Application</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Add New Event
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <main className="app-main">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          isExpanded={filtersPanelExpanded}
          onToggleExpand={() => setFiltersPanelExpanded(!filtersPanelExpanded)}
        />
        
        <div className="events-summary">
          Showing {filteredEvents.length} of {events.length} events
          {filters.searchText && ` matching "${filters.searchText}"`}
        </div>

        <CalendarComponent
          events={filteredEvents}
          onDateSelect={handleDateSelect}
          onEventSelect={handleEventSelect}
        />
        
        <EventList
          events={filteredEvents}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      </main>

      {showForm && (
        <EventForm
          event={selectedEvent}
          selectedDate={selectedDate || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default App;