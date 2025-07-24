/// <reference types="cypress" />

describe('Event Filtering', () => {
  beforeEach(() => {
    cy.deleteAllEvents();
    
    // Create test events with different properties
    const testEvents = [
      {
        title: 'High Priority Meeting',
        description: 'Important client meeting',
        date: '2025-08-15',
        startTime: '09:00',
        endTime: '10:00',
        priority: 'high' as 'high'
      },
      {
        title: 'Team Lunch',
        description: 'Monthly team lunch',
        date: '2025-08-16',
        startTime: '12:00',
        endTime: '13:00',
        priority: 'low' as 'low'
      },
      {
        title: 'Project Review',
        description: 'Quarterly project review',
        date: '2025-08-17',
        startTime: '14:00',
        endTime: '15:00',
        priority: 'medium' as 'medium'
      },
      {
        title: 'Past Event',
        description: 'This event is in the past',
        date: '2020-01-01',
        startTime: '10:00',
        endTime: '11:00',
        priority: 'low' as 'low'
      }
    ];

    testEvents.forEach(event => cy.createEvent(event));
    cy.visit('/');
  });

  it('should expand and collapse filter panel', () => {
    // Filter panel should be collapsed by default
    cy.get('.filter-panel').should('have.class', 'collapsed');
    cy.get('.filter-content').should('not.exist');

    // Expand filters
    cy.get('.filter-header').click();
    cy.get('.filter-panel').should('have.class', 'expanded');
    cy.get('.filter-content').should('be.visible');

    // Collapse filters
    cy.get('.filter-header').click();
    cy.get('.filter-panel').should('have.class', 'collapsed');
    cy.get('.filter-content').should('not.exist');
  });

  it('should filter by search text', () => {
    cy.expandFilters();

    // Search for "meeting"
    cy.get('#search').type('meeting');

    // Should show only events with "meeting" in title or description
    cy.get('.event-card').should('have.length', 1);
    cy.get('.event-card h3').contains('High Priority Meeting');

    // Clear search
    cy.get('#search').clear();
    cy.get('.event-card').should('have.length', 3); // Excluding past event

    // Search for "project"
    cy.get('#search').type('project');
    cy.get('.event-card').should('have.length', 1);
    cy.get('.event-card h3').contains('Project Review');
  });

  it('should filter by priority', () => {
    cy.expandFilters();

    // Initially all priorities should be checked
    cy.get('input[type="checkbox"]').eq(0).should('be.checked'); // High
    cy.get('input[type="checkbox"]').eq(1).should('be.checked'); // Medium
    cy.get('input[type="checkbox"]').eq(2).should('be.checked'); // Low

    // Uncheck high priority
    cy.get('.priority-filters input[type="checkbox"]').eq(0).click();
    cy.get('.event-card').should('have.length', 2);
    cy.get('.priority-badge.priority-high').should('not.exist');

    // Uncheck medium priority
    cy.get('.priority-filters input[type="checkbox"]').eq(1).click();
    cy.get('.event-card').should('have.length', 1);
    cy.get('.priority-badge.priority-low').should('be.visible');

    // Check only high priority
    cy.get('.priority-filters input[type="checkbox"]').eq(0).click();
    cy.get('.priority-filters input[type="checkbox"]').eq(2).click();
    cy.get('.event-card').should('have.length', 1);
    cy.get('.priority-badge.priority-high').should('be.visible');
  });

  it('should filter by date range', () => {
    cy.expandFilters();

    // Set date range
    cy.get('.date-input').eq(0).type('2025-08-15'); // Start date
    cy.get('.date-input').eq(1).type('2025-08-16'); // End date

    // Should show only events within the range
    cy.get('.event-card').should('have.length', 2);
    cy.get('.event-card h3').eq(0).contains('High Priority Meeting');
    cy.get('.event-card h3').eq(1).contains('Team Lunch');

    // Clear end date to test open-ended range
    cy.get('.date-input').eq(1).clear();
    cy.get('.event-card').should('have.length', 3);
  });

  it('should show/hide past events', () => {
    cy.expandFilters();

    // Past events should be hidden by default
    cy.get('.event-card').should('have.length', 3);
    cy.get('.event-card h3').contains('Past Event').should('not.exist');

    // Show past events
    cy.get('input[type="checkbox"]').last().click();
    cy.get('.event-card').should('have.length', 4);
    cy.get('.event-card h3').contains('Past Event').should('be.visible');

    // Hide past events again
    cy.get('input[type="checkbox"]').last().click();
    cy.get('.event-card').should('have.length', 3);
  });

  it('should combine multiple filters', () => {
    cy.expandFilters();

    // Show past events
    cy.get('input[type="checkbox"]').last().click();

    // Search for "team"
    cy.get('#search').type('team');

    // Should show only Team Lunch
    cy.get('.event-card').should('have.length', 1);
    cy.get('.event-card h3').contains('Team Lunch');

    // Uncheck low priority
    cy.get('.priority-filters input[type="checkbox"]').eq(2).click();
    
    // Should show no events
    cy.get('.no-events-container').should('be.visible');
  });

  it('should clear all filters', () => {
    cy.expandFilters();

    // Apply multiple filters
    cy.get('#search').type('meeting');
    cy.get('.priority-filters input[type="checkbox"]').eq(1).click(); // Uncheck medium
    cy.get('.date-input').eq(0).type('2025-08-15');

    // Clear all filters
    cy.get('.clear-btn').click();

    // All filters should be reset
    cy.get('#search').should('have.value', '');
    cy.get('.priority-filters input[type="checkbox"]').should('be.checked');
    cy.get('.date-input').should('have.value', '');
    cy.get('.event-card').should('have.length', 3);
  });

  it('should update event count display', () => {
    // Initially showing all non-past events
    cy.get('.events-summary').contains('Showing 3 of 4 events');

    cy.expandFilters();

    // Apply search filter
    cy.get('#search').type('meeting');
    cy.get('.events-summary').contains('Showing 1 of 4 events matching "meeting"');

    // Show past events
    cy.get('#search').clear();
    cy.get('input[type="checkbox"]').last().click();
    cy.get('.events-summary').contains('Showing 4 of 4 events');
  });
});