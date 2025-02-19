import React, { useState, useEffect } from "react";
import "./Calender.css";

type Holiday = {
  date: string;
  name: string;
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    fetchHolidays();
  }, [currentDate]);

  const fetchHolidays = async () => {
    try {
      const res = await fetch(`http://localhost:8080/holidays?month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`);
      const data = await res.json();
      setHolidays(data);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const addHoliday = async (date: string) => {
    const name = prompt("Enter holiday name:");
    if (!name) return;

    try {
      await fetch("http://localhost:8080/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, name }),
      });
      fetchHolidays();
    } catch (error) {
      console.error("Error adding holiday:", error);
    }
  };

  const deleteHoliday = async (date: string) => {
    try {
      await fetch(`http://localhost:8080/holidays/${date}`, { method: "DELETE" });
      fetchHolidays();
    } catch (error) {
      console.error("Error deleting holiday:", error);
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const calendarCells = [];

    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div className="empty-cell" key={`empty-${i}`} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
      const holiday = holidays.find((h) => h.date === date);

      calendarCells.push(
        <div className="day-cell" key={i} onDoubleClick={() => addHoliday(date)}>
          {i}
          {holiday && (
            <span className="holiday" onClick={() => deleteHoliday(date)}>
              {holiday.name} ❌
            </span>
          )}
        </div>
      );
    }

    return calendarCells;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>Prev</button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth}>Next</button>
      </div>
      <div className="calendar-grid">{renderCalendar()}</div>
    </div>
  );
};

export default Calendar;
