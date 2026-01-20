"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// Generate next 5 business days
const getNextBusinessDays = () => {
  const days = [];
  const today = new Date();
  let daysAdded = 0;
  const currentDate = new Date(today);

  while (daysAdded < 5) {
    const dayOfWeek = currentDate.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push(new Date(currentDate));
      daysAdded++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

export function MeetingScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const businessDays = getNextBusinessDays();

  // Pre-generate availability for stable rendering
  // Use deterministic availability based on time slot for demo
  const timeAvailability = useMemo(() => {
    return TIME_SLOTS.map((time, index) => ({
      time,
      // Make some slots unavailable in a predictable pattern
      available: index % 3 !== 0,
    }));
  }, []);

  const formatFullDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !name || !email) {
      alert("Please fill in all fields");
      return;
    }

    setShowConfirmation(true);
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setName("");
    setEmail("");
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card glow="cyan">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Meeting Confirmed!
            </h2>
            <p className="text-white/60 mb-6">
              Your meeting has been scheduled for{" "}
              <span className="text-white font-semibold">
                {selectedDate && formatFullDate(selectedDate)}
              </span>{" "}
              at{" "}
              <span className="text-white font-semibold">{selectedTime}</span>
            </p>
            <p className="text-sm text-white/40 mb-6">
              A calendar invite has been sent to {email}
            </p>
            <Button onClick={resetForm}>Schedule Another Meeting</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Schedule a Meeting
        </h1>
        <p className="text-white/60">
          Select a date and time that works best for you
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar & Time Slots */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4">
              Select Date & Time
            </h3>

            {/* Date Selection */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {businessDays.map((day, index) => {
                const isSelected =
                  selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null); // Reset time when date changes
                    }}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-xs mb-1">
                      {DAYS_OF_WEEK[day.getDay() - 1]}
                    </div>
                    <div className="text-sm font-semibold">
                      {day.getDate()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div>
                <h4 className="text-sm font-medium text-white/60 mb-3">
                  Available Times on {formatFullDate(selectedDate)}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {timeAvailability.map(({ time, available }) => {
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => available && setSelectedTime(time)}
                        disabled={!available}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-500/20 text-white"
                            : available
                            ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                            : "border-white/5 bg-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!selectedDate && (
              <div className="text-center py-8">
                <p className="text-white/40">Select a date to view times</p>
              </div>
            )}
          </div>
        </Card>

        {/* Booking Form */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold text-white mb-4">Your Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Selected Summary */}
              {selectedDate && selectedTime && (
                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <p className="text-sm text-white/60 mb-1">
                    You&apos;re scheduling:
                  </p>
                  <p className="font-semibold text-white">
                    {formatFullDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="text-xs text-white/40 mt-2">30 minute meeting</p>
                </div>
              )}

              <Button
                onClick={handleBooking}
                className="w-full mt-6"
                disabled={!selectedDate || !selectedTime || !name || !email}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
