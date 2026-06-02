export function HomePage({ view }) {
  const studentData = {
    name: "Alex Johnson",
    grade: "10th Grade",
    gpa: "3.8",
    attendance: "96%"
  };

  const teacherData = {
    name: "Ms. Sarah Williams",
    department: "Mathematics",
    classes: 4,
    students: 87
  };

  const upcomingEvents = [
    { title: "Math Quiz", date: "May 8", time: "10:00 AM" },
    { title: "Science Fair", date: "May 12", time: "2:00 PM" },
    {
      title: "Parent-Teacher Conference",
      date: "May 15",
      time: "4:00 PM"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="mb-4">
          Welcome back,{" "}
          {view === "student"
            ? studentData.name
            : teacherData.name}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {view === "student" ? (
            <>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Grade Level
                </p>
                <p>{studentData.grade}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  GPA
                </p>
                <p>{studentData.gpa}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Attendance
                </p>
                <p>{studentData.attendance}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Classes
                </p>
                <p>6 Active</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Department
                </p>
                <p>{teacherData.department}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Classes
                </p>
                <p>{teacherData.classes}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  Students
                </p>
                <p>{teacherData.students}</p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <p className="text-muted-foreground mb-1">
                  This Week
                </p>
                <p>12 Assignments</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="mb-4">Upcoming Events</h3>

        <div className="space-y-3">
          {upcomingEvents.map((event, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p>{event.title}</p>
                <p className="text-muted-foreground">
                  {event.time}
                </p>
              </div>

              <span className="text-muted-foreground">
                {event.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
