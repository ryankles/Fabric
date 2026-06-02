function GradesPage({ view }) {
  const studentGrades = [
    {
      subject: "Mathematics",
      grade: "A-",
      percentage: 92,
      teacher: "Ms. Williams"
    },
    {
      subject: "English Literature",
      grade: "B+",
      percentage: 88,
      teacher: "Mr. Thompson"
    },
    {
      subject: "Physics",
      grade: "A",
      percentage: 95,
      teacher: "Dr. Chen"
    },
    {
      subject: "History",
      grade: "B",
      percentage: 85,
      teacher: "Ms. Davis"
    },
    {
      subject: "Spanish",
      grade: "A-",
      percentage: 91,
      teacher: "Señora Garcia"
    },
    {
      subject: "Art",
      grade: "A",
      percentage: 97,
      teacher: "Mr. Martinez"
    }
  ];

  const teacherClasses = [
    {
      class: "Algebra II - Period 1",
      students: 24,
      avgGrade: "B+",
      avgPercentage: 87
    },
    {
      class: "Geometry - Period 3",
      students: 22,
      avgGrade: "A-",
      avgPercentage: 90
    },
    {
      class: "Calculus - Period 5",
      students: 18,
      avgGrade: "B",
      avgPercentage: 84
    },
    {
      class: "Pre-Algebra - Period 7",
      students: 23,
      avgGrade: "B+",
      avgPercentage: 88
    }
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6">
        {view === "student" ? "My Grades" : "Class Averages"}
      </h2>
      <div className="space-y-3">
        {view === "student"
          ? studentGrades.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="flex-1">
                  <p>{item.subject}</p>
                  <p className="text-muted-foreground">
                    {item.teacher}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground">
                    {item.percentage}%
                  </span>
                  <span className="min-w-[3rem] rounded-md bg-card px-3 py-1 text-center">
                    {item.grade}
                  </span>
                </div>
              </div>
            ))
          : teacherClasses.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="flex-1">
                  <p>{item.class}</p>
                  <p className="text-muted-foreground">
                    {item.students} students
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-muted-foreground">
                    {item.avgPercentage}%
                  </span>
                  <span className="min-w-[3rem] rounded-md bg-card px-3 py-1 text-center">
                    {item.avgGrade}
                  </span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default GradesPage;
