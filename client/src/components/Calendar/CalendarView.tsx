import { useState, useMemo } from "react";
import {
  startOfWeek,
  addDays,
  format,
  addWeeks,
  subWeeks,
  isToday,
  isThisWeek,
} from "date-fns";
import "./Calendar.css";

interface Card {
  name: string;
  image: string;
}

interface Reading {
  id: number;
  date: string;
  reading: string;
  cards: Card[];
}

interface ModalState {
  dateKey: string;
  show: boolean;
}

export default function CalendarView() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [modalState, setModalState] = useState<ModalState>({
    dateKey: "",
    show: false,
  });

  // Parse readings once and memoize
  const readings = useMemo<Reading[]>(() => {
    try {
      const stored = localStorage.getItem("readings");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to parse readings from localStorage:", error);
      return [];
    }
  }, []);

  const isCurrentWeek = isThisWeek(currentWeek, { weekStartsOn: 0 });
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const selectedReading = readings.find((r) => r.date === modalState.dateKey);

  const handleDayClick = (dateKey: string) => {
    setModalState({ show: true, dateKey });
  };

  const handleCloseModal = () => {
    setModalState({ show: false, dateKey: "" });
  };

  return (
    <div>
      <div>
        {/* Navigation */}
        <div className="week-nav">
          <button onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
            Previous Week
          </button>
          <span>
            {format(weekStart, "MMM d")} -{" "}
            {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </span>
          <button
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
            disabled={isCurrentWeek}
          >
            Next Week
          </button>
        </div>

        {/* Week Grid */}
        <div className="week-grid">
          {days.map((day) => {
            const dayString = format(day, "yyyy-MM-dd");
            const dayReading = readings.find((r) => r.date === dayString);

            return (
              <DayTile
                key={dayString}
                day={day}
                reading={dayReading}
                isToday={isToday(day)}
                onClick={() => dayReading && handleDayClick(dayReading.date)}
              />
            );
          })}
        </div>
      </div>

      {/* Expanded card view */}
      {modalState.show && selectedReading && (
        <ReadingModal reading={selectedReading} onClose={handleCloseModal} />
      )}
    </div>
  );
}

interface DayTileProps {
  day: Date;
  reading?: Reading;
  isToday: boolean;
  onClick: () => void;
}

function DayTile({ day, reading, isToday, onClick }: DayTileProps) {
  return (
    <div
      className={`day-tile ${isToday ? "today" : ""} ${
        !reading ? "empty" : ""
      }`}
      onClick={onClick}
      style={{ cursor: reading ? "pointer" : "default" }}
    >
      <div className="day-header">
        <div className="day-name">{format(day, "EEE")}</div>
        <div className="day-number">{format(day, "d")}</div>
      </div>

      {reading && (
        <div className="cards-preview">
          {reading.cards.map((card) => (
            <img
              key={card.name}
              src={card.image}
              alt={card.name}
              className="card-image"
              loading="eager"
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface ReadingModalProps {
  reading: Reading;
  onClose: () => void;
}

function ReadingModal({ reading, onClose }: ReadingModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-md flex items-center justify-center z-50 p-6">
      <div className="bg-gray-900 rounded-xl max-w-5xl w-full p-6 relative overflow-y-auto max-h-full flex flex-col gap-8">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-purple-400 hover:text-purple-300 bg-black/40 p-2 rounded-full"
          aria-label="Close modal"
        >
          ✕
        </button>

        <p className="text-gray-400 text-lg">
          {format(new Date(reading.date), "MMMM d, yyyy")}
        </p>

        <div className="grid grid-cols-3 gap-4">
          {reading.cards.map((card) => (
            <img
              key={card.name}
              src={card.image}
              alt={card.name}
              className="w-full h-auto aspect-[2/3] object-fit rounded-lg"
              loading="eager"
            />
          ))}
        </div>

        <p className="whitespace-pre-wrap text-gray-200 leading-relaxed">
          {reading.reading}
        </p>
      </div>
    </div>
  );
}