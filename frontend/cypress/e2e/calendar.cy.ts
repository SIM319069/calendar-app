/// <reference types="cypress" />

describe('Calendar Navigation and Views', () => {
  beforeEach(() => {
    cy.deleteAllEvents();
    
    // Create some test events
    cy.fixture('events').then((events) => {
      cy.createEvent(events.validEvent);
      cy.createEvent(events.highPriorityEvent);
      cy.createEvent(events.lowPriorityEvent);
    });
    
    cy.visit('/');
  });

  it('should display calendar with month view by default', () => {
    cy.get('.fc').should('be.visible');
    cy.get('.fc-dayGridMonth-view').should('be.visible');
    cy.get('.fc-toolbar-title').should('be.visible');
  });

  it('should switch between calendar views', () => {
    // Switch to week view
    cy.get('.view-buttons button').contains('Week').click();
    cy.get('.fc-timeGridWeek-view').should('be.visible');
    cy.get('.view-buttons button.active').contains('Week');

    // Switch to day view
    cy.get('.view-buttons button').contains('Day').click();
    cy.get('.fc-timeGridDay-view').should('be.visible');
    cy.get('.view-buttons button.active').contains('Day');

    // Switch to list view
    cy.get('.view-buttons button').contains('List').click();
    cy.get('.fc-listWeek-view').should('be.visible');
    cy.get('.view-buttons button.active').contains('List');

    // Back to month view
    cy.get('.view-buttons button').contains('Month').click();
    cy.get('.fc-dayGridMonth-view').should('be.visible');
    cy.get('.view-buttons button.active').contains('Month');
  });

  it('should display events on calendar', () => {
    // Check that events are visible
    cy.get('.fc-event').should('have.length.at.least', 3);
    
    // Check event titles
    cy.get('.fc-event-title').contains('Team Meeting');
    cy.get('.fc-event-title').contains('Product Launch');
    cy.get('.fc-event-title').contains('Coffee Break');
  });

  it('should show event colors based on priority', () => {
    // Check high priority event (red)
    cy.get('.fc-event.priority-high').should('have.css', 'background-color', 'rgb(244, 67, 54)');
    
    // Check medium priority event (orange)
    cy.get('.fc-event.priority-medium').should('have.css', 'background-color', 'rgb(255, 152, 0)');
    
    // Check low priority event (green)
    cy.get('.fc-event.priority-low').should('have.css', 'background-color', 'rgb(76, 175, 80)');
  });

  it('should create event by clicking on a date', () => {
    // Find a date without events and click it
    cy.get('.fc-daygrid-day').not(':has(.fc-event)').first().click();
    
    // Event form should open
    cy.get('.event-form-overlay').should('be.visible');
    
    // Date should be pre-filled
    cy.get('#date').should('not.have.value', '');
  });

  it('should open event details when clicking an event', () => {
    // Click on an event in the calendar
    cy.get('.fc-event').first().click();
    
    // Event form should open in edit mode
    cy.get('.event-form-overlay').should('be.visible');
    cy.get('.event-form-container h2').contains('Edit Event');
    
    // Form should be populated with event data
    cy.get('#title').should('not.have.value', '');
  });

  it('should display priority legend', () => {
    cy.get('.calendar-legend').should('be.visible');
    cy.get('.legend-item').should('have.length', 3);
    
    // Check legend items
    cy.get('.legend-item').contains('High Priority');
    cy.get('.legend-item').contains('Medium Priority');
    cy.get('.legend-item').contains('Low Priority');
    
    // Check legend colors
    cy.get('.legend-color.high').should('have.css', 'background-color', 'rgb(244, 67, 54)');
    cy.get('.legend-color.medium').should('have.css', 'background-color', 'rgb(255, 152, 0)');
    cy.get('.legend-color.low').should('have.css', 'background-color', 'rgb(76, 175, 80)');
  });
});