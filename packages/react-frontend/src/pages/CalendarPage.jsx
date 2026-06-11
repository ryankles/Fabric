import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_PREFIX ||
  "http://localhost:8000";

const daysOfWeek = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat"
];

function CalendarPage() {
  const [data, setData] = useState({ courses: [], events: [] });
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/calendar`, {
      credentials: "include"
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load calendar");
        }

        return res.json();
      })
      .then((json) => {
        setData(json);
        setSelectedClasses(
          json.courses.map((course) => String(course._id))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleClass = (classId) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p>Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const now = new Date();
  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  );
  const currentMonth = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const events = data.events.filter((event) =>
    selectedClasses.includes(String(event.courseId))
  );

  const monthlyEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === now.getMonth() &&
      eventDate.getFullYear() === now.getFullYear()
    );
  });

  const leadingEmptyDays = Array.from(
    { length: monthStart.getDay() },
    (_, index) => ({
      key: `empty-${index}`,
      day: null
    })
  );

  const datedDays = Array.from(
    { length: monthEnd.getDate() },
    (_, index) => {
      const day = index + 1;
      const dayEvents = monthlyEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day;
      });

      return {
        key: `day-${day}`,
        day,
        eventCount: dayEvents.length,
        isToday: day === now.getDate()
      };
    }
  );

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= now)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {data.courses.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3">Filter by Class</h4>
          <div className="flex flex-wrap gap-2">
            {data.courses.map((course) => {
              const courseId = String(course._id);

              return (
                <button
                  key={courseId}
                  type="button"
                  onClick={() => toggleClass(courseId)}
                  className={
                    selectedClasses.includes(courseId)
                      ? "rounded-lg bg-primary px-3 py-1 text-primary-foreground transition-colors"
                      : "rounded-lg bg-muted px-3 py-1 text-muted-foreground transition-colors hover:bg-accent"
                  }>
                  {course.title}
                </button>
              );
            })}
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
                className="p-2 text-center text-muted-foreground">
                {day}
              </div>
            ))}

            {[...leadingEmptyDays, ...datedDays].map((item) => (
              <div
                key={item.key}
                className={
                  item.day === null
                    ? "relative flex aspect-square items-center justify-center rounded-lg"
                    : item.isToday
                      ? "relative flex aspect-square items-center justify-center rounded-lg bg-primary text-primary-foreground"
                      : item.eventCount
                        ? "relative flex aspect-square items-center justify-center rounded-lg bg-accent"
                        : "relative flex aspect-square items-center justify-center rounded-lg bg-muted"
                }>
                {item.day && (
                  <>
                    <span>{item.day}</span>
                    {item.eventCount > 0 && !item.isToday && (
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
            {upcomingEvents.length ? (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg bg-muted p-3">
                  <p className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p>{event.title}</p>
                  <p className="mt-1 text-muted-foreground">
                    {event.courseTitle}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">
                No calendar items yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
