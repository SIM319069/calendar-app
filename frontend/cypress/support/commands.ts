/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      createEvent(event: {
        title: string;
        description?: string;
        date: string;
        startTime: string;
        endTime: string;
        priority: 'low' | 'medium' | 'high';
      }): Chainable<void>;
      
      deleteAllEvents(): Chainable<void>;
      
      selectDate(date: string): Chainable<void>;
      
      expandFilters(): Chainable<void>;
      
      collapseFilters(): Chainable<void>;
    }
  }
}

// Custom command to create an event via API
Cypress.Commands.add('createEvent', (event) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/events`, event);
});

// Custom command to delete all events
Cypress.Commands.add('deleteAllEvents', () => {
  cy.request('GET', `${Cypress.env('apiUrl')}/events`).then((response) => {
    const events = response.body.data;
    events.forEach((event: any) => {
      cy.request('DELETE', `${Cypress.env('apiUrl')}/events/${event.id}`);
    });
  });
});

// Custom command to select a date in the calendar
Cypress.Commands.add('selectDate', (date) => {
  // Format: YYYY-MM-DD
  const [year, month, day] = date.split('-');
  const dayNumber = parseInt(day, 10);
  
  // Find and click the date in the calendar
  cy.get('.fc-daygrid-day').each(($el) => {
    const ariaLabel = $el.attr('aria-label');
    if (ariaLabel && ariaLabel.includes(`${year}-${month}-${day.padStart(2, '0')}`)) {
      cy.wrap($el).click();
    }
  });
});

// Custom command to expand filter panel
Cypress.Commands.add('expandFilters', () => {
  cy.get('.filter-panel').then(($panel) => {
    if ($panel.hasClass('collapsed')) {
      cy.get('.filter-header').click();
    }
  });
});

// Custom command to collapse filter panel
Cypress.Commands.add('collapseFilters', () => {
  cy.get('.filter-panel').then(($panel) => {
    if ($panel.hasClass('expanded')) {
      cy.get('.filter-header').click();
    }
  });
});

export {};