# Data Model Diagrams

## Entity Overview

The Fabric data model centers on users, courses, enrollments, course content, coursework, and grading.

## Diagram Asset

- Existing image diagram: [`Untitled-1.png`](../Untitled-1.png)

## Mermaid Class Diagram

```mermaid
classDiagram
  class User {
    ObjectId _id
    string name
    string email
    string passwordHash
    string role
    Date createdAt
    Date updatedAt
  }

  class Course {
    ObjectId _id
    string title
    string code
    string term
    string description
    ObjectId teacherId
    Date createdAt
    Date updatedAt
  }

  class Enrollment {
    ObjectId _id
    ObjectId userId
    ObjectId courseId
    string role
    Date createdAt
    Date updatedAt
  }

  class Material {
    ObjectId _id
    ObjectId courseId
    string title
    string description
    string type
    string url
    string content
    ObjectId createdBy
    Date createdAt
    Date updatedAt
  }

  class Assignment {
    ObjectId _id
    ObjectId courseId
    string title
    string description
    Date dueDate
    number pointsPossible
    string type
    ObjectId createdBy
    Date createdAt
    Date updatedAt
  }

  class Submission {
    ObjectId _id
    ObjectId assignmentId
    ObjectId courseId
    ObjectId studentId
    string text
    Date createdAt
    Date updatedAt
  }

  class Grade {
    ObjectId _id
    ObjectId assignmentId
    ObjectId courseId
    ObjectId studentId
    number score
    number pointsPossible
    string feedback
    ObjectId gradedBy
    Date createdAt
    Date updatedAt
  }

  class Announcement {
    ObjectId _id
    ObjectId courseId
    string title
    string body
    string type
    Date publishAt
    ObjectId createdBy
    Date createdAt
    Date updatedAt
  }

  User "1" --> "*" Course : teaches
  User "1" --> "*" Enrollment : joins
  Course "1" --> "*" Enrollment : contains
  Course "1" --> "*" Material : has
  Course "1" --> "*" Assignment : has
  Course "1" --> "*" Announcement : has
  Assignment "1" --> "*" Submission : receives
  Assignment "1" --> "*" Grade : receives
  User "1" --> "*" Submission : submits
  User "1" --> "*" Grade : receives
```

## Relationship Summary

- A teacher owns many courses.
- Students join courses through enrollments.
- Courses contain materials, assignments, and announcements.
- Assignments can receive submissions and grades.
- Grades connect a student to an assignment within a course.
