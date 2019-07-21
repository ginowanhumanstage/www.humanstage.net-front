import React from 'react';
import styled, { css } from 'styled-components';
import {
  format,
  eachDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
} from 'date-fns';

interface IProps {
  date: string; // 'YYYY-MM-DD'
  slugs: string[];
}

export default class Calendar extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.days = this.days.bind(this);
  }

  days() {
    const days = [];
    const startDate = startOfMonth(this.props.date);
    const endDate = endOfMonth(this.props.date);
    const startDateOfWeek = startOfWeek(startDate);
    const dayList = eachDay(startDate, endDate);
    const lastMonthDates = eachDay(startDateOfWeek, subDays(startDate, 1));

    // カレンダー内の前月の穴埋め
    lastMonthDates.forEach(day => {
      days.push(
        <DayItem key={format(day, 'YYYYMMDD')} lastMonth>
          {format(day, 'D')}
        </DayItem>,
      );
    });

    // カレンダーの日付の生成
    dayList.forEach(day => {
      let hasEvent = false;
      let isHoliday = false;
      let isTavern = false;
      const fullDate = format(day, 'YYYYMMDD');

      if (
        this.props.slugs &&
        this.props.slugs.find(slug => slug === fullDate)
      ) {
        hasEvent = true;
      } else if (isMonday(day)) {
        isHoliday = true;
      } else if (
        isTuesday(day) ||
        isWednesday(day) ||
        isThursday(day) ||
        isFriday(day)
      ) {
        isTavern = true;
      }

      days.push(
        <DayItem
          key={fullDate}
          hasEvent={hasEvent}
          isHoliday={isHoliday}
          isTavern={isTavern}
        >
          <span>{format(day, 'D')}</span>
        </DayItem>,
      );
    });

    return days;
  }

  dayHeaders() {
    const dayHeaders = [];

    const days = eachDay(
      startOfWeek(this.props.date),
      endOfWeek(this.props.date),
    );

    days.forEach(day => {
      dayHeaders.push(
        <DayHeader key={format(day, 'YYYYMMDD')}>
          {format(day, 'dd')}
        </DayHeader>,
      );
    });

    return dayHeaders;
  }

  render() {
    return (
      <CalendarWrapper>
        <DayList>
          {this.dayHeaders()}
          {this.days()}
        </DayList>
        <Marks>
          <span>
            <MarkOfEvent />
            イベント日
          </span>
          <span>
            <MarkOfTavern />
            居酒屋営業日
          </span>
        </Marks>
      </CalendarWrapper>
    );
  }
}

const CalendarWrapper = styled.div`
  font-size: 0.85rem;
  text-align: center;
  width: calc(100% - 2rem);
  margin: 0 auto;

  @media (min-width: 768px) {
    font-size: 1rem;
    width: calc(100% - 100px);
  }
`;

const DayList = styled.ul`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  list-style: none;
  padding: 0;
`;

const DayHeader = styled.li`
  padding: 0.5rem 0;
`;

const activeStyles = `
  > span {
    background-color: #96d7ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border-radius: 30px;
    width: 2rem;
    height: 2rem;
  }
`;

const holidayStyles = `
  color: #ccc;
`;

const tavernStyles = `
  > span {
    background-color: #ffd5a6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border-radius: 30px;
    width: 2rem;
    height: 2rem;
  }
`;

const DayItem = styled.li`
  padding: .5rem 0;
  visibility: ${props => (props.lastMonth ? 'hidden' : 'visible')};

  ${props =>
    props.hasEvent
      ? css`
          ${activeStyles}
        `
      : ''}

  ${props =>
    props.isHoliday
      ? css`
          ${holidayStyles}
        `
      : ''}

  ${props =>
    props.isTavern
      ? css`
          ${tavernStyles}
        `
      : ''}

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const Marks = styled.p`
  text-align: right;
`;

const MarkOfEvent = styled.i`
  display: inline-block;
  background-color: #96d7ff;
  width: 1rem;
  height: 1rem;
  vertical-align: bottom;
  margin-right: 0.25rem;
`;

const MarkOfTavern = styled.i`
  display: inline-block;
  background-color: #ffd5a6;
  width: 1rem;
  height: 1rem;
  vertical-align: bottom;
  margin-left: 0.5rem;
  margin-right: 0.25rem;
`;
