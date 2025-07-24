/// <reference types="cypress" />

describe('Event CRUD Operations', () => {
  beforeEach(() => {
    cy.deleteAllEvents();
    cy.visit('/');
  });

  it('should create a new event', () => {
    // Click Add New Event button
    cy.get('.btn-primary').contains('Add New Event').click();

    // Fill out the form
    cy.get('#title').type('Test Event');
    cy.get('#description').type('This is a test event description');
    cy.get('#date').type('2025-08-15');
    cy.get('#startTime').type('10:00');
    cy.get('#endTime').type('11:00');
    cy.get('#priority').select('medium');

    // Submit the form
    cy.get('.btn-submit').click();

    // Verify event appears in calendar
    cy.get('.fc-event-title').contains('Test Event').should('be.visible');
    
    // Verify event appears in event list
    cy.get('.event-card').should('have.length', 1);
    cy.get('.event-card h3').contains('Test Event');
    cy.get('.priority-badge.priority-medium').should('be.visible');
  });

  it('should edit an existing event', () => {
    // Create an event first
    cy.fixture('events').then((events) => {
      cy.createEvent(events.validEvent);
    });
    cy.reload();

    // Click on the event in the list
    cy.get('.event-card .btn-edit').first().click();

    // Update the event details
    cy.get('#title').clear().type('Updated Team Meeting');
    cy.get('#description').clear().type('Updated description');
    cy.get('#priority').select('high');

    // Submit the form
    cy.get('.btn-submit').click();

    // Verify updates
    cy.get('.event-card h3').contains('Updated Team Meeting');
    cy.get('.priority-badge.priority-high').should('be.visible');
  });

  it('should delete an event', () => {
    // Create an event first
    cy.fixture('events').then((events) => {
      cy.createEvent(events.validEvent);
    });
    cy.reload();

    // Verify event exists
    cy.get('.event-card').should('have.length', 1);

    // Delete the event
    cy.get('.event-card .btn-delete').first().click();
    
    // Confirm deletion
    cy.on('window:confirm', () => true);

    // Verify event is removed
    cy.get('.no-events-container').should('be.visible');
    cy.get('.no-events').contains('No events found');
  });

  it('should handle multiple events', () => {
    // Create multiple events
    cy.fixture('events').then((events) => {
      events.multipleEvents.forEach((event: any) => {
        cy.createEvent(event);
      });
    });
    cy.reload();

    // Verify all events are displayed
    cy.get('.event-card').should('have.length', 3);
    
    // Verify events are sorted by date and time
    cy.get('.event-card h3').first().contains('Morning Standup');
    cy.get('.event-card h3').last().contains('Code Review');
  });

  it('should cancel event creation', () => {
    // Click Add New Event button
    cy.get('.btn-primary').contains('Add New Event').click();

    // Fill some fields
    cy.get('#title').type('Cancelled Event');

    // Click cancel
    cy.get('.btn-cancel').click();

    // Form should close without creating event
    cy.get('.event-form-overlay').should('not.exist');
    cy.get('.event-card').should('not.exist');
  });
});