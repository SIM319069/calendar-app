import React from 'react';
import { format } from 'date-fns';
import { IEventFilters } from '../../types';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: IEventFilters;
  onFiltersChange: (filters: IEventFilters) => void;
  onClearFilters: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isExpanded,
  onToggleExpand,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchText: e.target.value,
    });
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    onFiltersChange({
      ...filters,
      priorities: {
        ...filters.priorities,
        [priority]: !filters.priorities[priority],
      },
    });
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : null,
      },
    });
  };

  const handleShowPastEventsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      showPastEvents: e.target.checked,
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchText !== '' ||
      !filters.priorities.low ||
      !filters.priorities.medium ||
      !filters.priorities.high ||
      filters.dateRange.start !== null ||
      filters.dateRange.end !== null ||
      !filters.showPastEvents
    );
  };

  return (
    <div className={`filter-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="filter-header">
        <h3>
          <svg className="filter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
          </svg>
          Filters
          {hasActiveFilters() && <span className="active-indicator"></span>}
        </h3>
        <button className="toggle-btn" onClick={onToggleExpand}>
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-content">
          {/* Search Filter */}
          <div className="filter-section">
            <label htmlFor="search">Search Events</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or description..."
              value={filters.searchText}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Priority Filter */}
          <div className="filter-section">
            <label>Priority Levels</label>
            <div className="priority-filters">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.priorities.high}
                  onChange={() => handlePriorityChange('high')}
                />
                <span className="priority-indicator high"></span>
                High
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.priorities.medium}
                  onChange={() => handlePriorityChange('medium')}
                />
                <span className="priority-indicator medium"></span>
                Medium
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={filters.priorities.low}
                  onChange={() => handlePriorityChange('low')}
                />
                <span className="priority-indicator low"></span>
                Low
              </label>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="filter-section">
            <label>Date Range</label>
            <div className="date-range">
              <input
                type="date"
                value={filters.dateRange.start ? format(filters.dateRange.start, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="date-input"
                placeholder="Start date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={filters.dateRange.end ? format(filters.dateRange.end, 'yyyy-MM-dd') : ''}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="date-input"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Additional Options */}
          <div className="filter-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.showPastEvents}
                onChange={handleShowPastEventsChange}
              />
              Show past events
            </label>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button 
              className="clear-btn" 
              onClick={onClearFilters}
              disabled={!hasActiveFilters()}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};