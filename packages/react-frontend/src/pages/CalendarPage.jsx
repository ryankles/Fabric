import { useState } from "react";

function CalendarPage({ view }) {
  const currentMonth = "May 2026";
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const classes =
    view === "student"
      ? [
          "Mathematics",
          "English Literature",
          "Physics",
          "History",
          "Spanish",
          "Art"
        ]
      : ["Algebra II", "Geometry", "Calculus", "Pre-Algebra"];

  const [selectedClasses, setSelectedClasses] = useState(classes);

  const toggleClass = (className) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const calendarDays = [
    { day: null },
    { day: null },
    { day: null },
    { day: null },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6, event: true },
    { day: 7 },
    { day: 8, event: true },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12, event: true },
    { day: 13 },
    { day: 14 },
    { day: 15, event: true },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 }
  ];

  const allEvents =
    view === "student"
      ? [
          { date: "May 6", title: "Today - Regular Classes", class: null },
          { date: "May 8", title: "Math Quiz", class: "Mathematics" },
          {
            date: "May 10",
            title: "English Essay Due",
            class: "English Literature"
          },
          {
            date: "May 11",
            title: "Math Quiz - Functions",
            class: "Mathematics"
          },
          { date: "May 12", title: "Science Fair", class: "Physics" },
          {
            date: "May 13",
            title: "Physics Lab Report Due",
            class: "Physics"
          },
          { date: "May 14", title: "Art Project Due", class: "Art" },
          {
            date: "May 15",
            title: "Parent-Teacher Conference",
            class: null
          }
        ]
      : [
          { date: "May 6", title: "Today - Regular Schedule", class: null },
          { date: "May 8", title: "Quiz Day - All Periods", class: null },
          { date: "May 12", title: "Science Fair - Afternoon", class: null },
          {
            date: "May 15",
            title: "Parent Conferences 2-6 PM",
            class: null
          }
        ];

  const events = allEvents.filter(
    (event) => event.class === null || selectedClasses.includes(event.class)
  );

  return (
    <div className="space-y-6">
      {view === "student" && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3">Filter by Class</h4>
          <div className="flex flex-wrap gap-2">
            {classes.map((className) => (
              <button
                key={className}
                type="button"
                onClick={() => toggleClass(className)}
                className={
                  selectedClasses.includes(className)
                    ? "rounded-lg bg-primary px-3 py-1 text-primary-foreground transition-colors"
                    : "rounded-lg bg-muted px-3 py-1 text-muted-foreground transition-colors hover:bg-accent"
                }
              >
                {className}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <h2 className="mb-4">{currentMonth}</h2>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {calendarDays.map((item, index) => (
              <div
                key={index}
                className={
                  item.day === null
                    ? "relative flex aspect-square items-center justify-center rounded-lg"
                    : item.day === 6
                      ? "relative flex aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground"
                      : item.event
                        ? "relative flex aspect-square items-center justify-center rounded-lg bg-accent"
                        : "relative flex aspect-square cursor-pointer items-center justify-center rounded-lg bg-muted transition-colors hover:bg-accent"
                }
              >
                {item.day && (
                  <>
                    <span>{item.day}</span>
                    {item.event && item.day !== 6 && (
                      <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4">Upcoming</h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <div key={index} className="rounded-lg bg-muted p-3">
                <p className="text-muted-foreground">{event.date}</p>
                <p>{event.title}</p>
                {event.class && (
                  <p className="mt-1 text-muted-foreground">{event.class}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
