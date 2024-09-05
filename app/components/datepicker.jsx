"use client";
import React, { useState, useEffect, useCallback } from "react";
import { RRule } from "rrule";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

const DatePickerReact = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [isToggled, setIsToggled] = useState(false);
  const [repeatType, setRepeatType] = useState("None");
  const [highlightDates, setHighlightDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  }, []);

  const handleMonthChange = useCallback((date) => {
    setCurrentDate(date);
  }, []);

  const toggle = useCallback(() => {
    setIsToggled((prev) => !prev);
  }, []);

  const handleRepeatChange = useCallback((event) => {
    setRepeatType(event.target.value);
  }, []);

  useEffect(() => {
    const generateHighlightDates = () => {
      if (repeatType === "None") return [];

      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const ruleConfig = {
        freq: RRule[repeatType.toUpperCase()],
        dtstart: startDate,
        until:
          repeatType === "Yearly"
            ? new Date(currentDate.getFullYear() + 5, 11, 31)
            : endOfMonth,
      };

      return new RRule(ruleConfig).all();
    };

    setHighlightDates(generateHighlightDates());
  }, [repeatType, startDate, currentDate]);

  return (
    <div className="custom-datepicker-wrapper">
      <div className="flex justify-center">
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          inline
          highlightDates={highlightDates}
          onMonthChange={handleMonthChange}
        />
      </div>
      <div className="event-details">
        <label className="text-black" htmlFor="event-name-input">
          Event name
        </label>
        <input
          id="event-name-input"
          type="text"
          placeholder="Event name"
          className="event-name-input text-black"
        />
        <div className="repeat-toggle">
          <label htmlFor="repeat-toggle">Repeat?</label>
          <input
            id="repeat-toggle"
            type="checkbox"
            checked={isToggled}
            onChange={toggle}
          />
        </div>
        {isToggled && (
          <select
            value={repeatType}
            onChange={handleRepeatChange}
            className="repeat-select"
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Yearly">Yearly</option>
          </select>
        )}
        <button className="add-event-button">
          Add event on {formatDate(startDate)}
        </button>
      </div>
    </div>
  );
};

export default DatePickerReact;
