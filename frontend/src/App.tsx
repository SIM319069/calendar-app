import React, { useState, useEffect } from 'react';
import { CalendarComponent } from './components/Calendar';
import { EventForm } from './components/EventForm';
import { EventList } from './components/EventList';
import { IEvent } from './types';
import { eventApi } from './services/api';
import './App.css';

function App() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

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
        <CalendarComponent
          events={events}
          onDateSelect={handleDateSelect}
          onEventSelect={handleEventSelect}
        />
        <EventList
          events={events}
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