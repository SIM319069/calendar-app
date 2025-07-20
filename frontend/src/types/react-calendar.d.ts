declare module 'react-calendar' {
  import { Component } from 'react';

  export type CalendarType = 'ISO 8601' | 'US' | 'Arabic' | 'Hebrew';
  export type Detail = 'month' | 'year' | 'decade' | 'century';
  export type DateCallback = (value: Date, event: React.MouseEvent<HTMLButtonElement>) => void;
  export type ClickWeekNumberCallback = (weekNumber: number, date: Date, event: React.MouseEvent<HTMLButtonElement>) => void;
  export type OnChangeDateCallback = (value: Date | [Date, Date] | null, event: React.MouseEvent<HTMLButtonElement>) => void;
  export type FormatterCallback = (locale: string, date: Date) => string;
  export type ViewCallback = (props: ViewCallbackProperties) => void;
  export type DrillCallback = (props: DrillCallbackProperties) => void;

  export interface ViewCallbackProperties {
    activeStartDate: Date;
    view: Detail;
  }

  export interface DrillCallbackProperties {
    activeStartDate: Date;
    view: Detail;
  }

  export interface CalendarTileProperties {
    activeStartDate: Date;
    date: Date;
    view: Detail;
  }

  export interface CalendarProps {
    activeStartDate?: Date;
    allowPartialRange?: boolean;
    calendarType?: CalendarType;
    className?: string | string[];
    closeCalendar?: boolean;
    defaultActiveStartDate?: Date;
    defaultValue?: Date | [Date, Date];
    defaultView?: Detail;
    formatDay?: FormatterCallback;
    formatLongDate?: FormatterCallback;
    formatMonth?: FormatterCallback;
    formatMonthYear?: FormatterCallback;
    formatShortWeekday?: FormatterCallback;
    formatYear?: FormatterCallback;
    inputRef?: React.Ref<HTMLInputElement>;
    locale?: string;
    maxDate?: Date;
    maxDetail?: Detail;
    minDate?: Date;
    minDetail?: Detail;
    navigationAriaLabel?: string;
    navigationAriaLive?: 'off' | 'polite' | 'assertive';
    navigationLabel?: (props: { date: Date; label: string; locale: string; view: Detail }) => string | JSX.Element | null;
    nextAriaLabel?: string;
    nextLabel?: string | JSX.Element | null;
    next2AriaLabel?: string;
    next2Label?: string | JSX.Element | null;
    onActiveStartDateChange?: ViewCallback;
    onChange?: OnChangeDateCallback;
    onViewChange?: ViewCallback;
    onClickDay?: DateCallback;
    onClickDecade?: DateCallback;
    onClickMonth?: DateCallback;
    onClickWeekNumber?: ClickWeekNumberCallback;
    onClickYear?: DateCallback;
    onDrillDown?: DrillCallback;
    onDrillUp?: DrillCallback;
    prev2AriaLabel?: string;
    prev2Label?: string | JSX.Element | null;
    prevAriaLabel?: string;
    prevLabel?: string | JSX.Element | null;
    returnValue?: 'start' | 'end' | 'range';
    selectRange?: boolean;
    showFixedNumberOfWeeks?: boolean;
    showNavigation?: boolean;
    showNeighboringMonth?: boolean;
    showWeekNumbers?: boolean;
    tileClassName?: string | string[] | ((props: CalendarTileProperties) => string | string[] | null);
    tileContent?: ((props: CalendarTileProperties) => JSX.Element | null) | JSX.Element | null;
    tileDisabled?: (props: CalendarTileProperties) => boolean;
    value?: Date | [Date, Date] | null;
    view?: Detail;
  }

  export default class Calendar extends Component<CalendarProps> {}
}