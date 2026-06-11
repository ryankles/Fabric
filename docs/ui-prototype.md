# UI Prototype

## Current Prototype Direction

The current UI prototype is a dashboard-style web app with separate student and teacher views. After sign-in, users navigate between:

- Home
- Announcements
- Materials
- Calendar
- Grades

The teacher flow emphasizes content creation and class management. The student flow emphasizes visibility into assignments, reminders, and performance.

## Reference Assets

- Class/data model visual: [`Untitled-1.png`](../Untitled-1.png)
- Interaction/sequence visual: [`packages/Sequence Diagram.png`](../packages/Sequence%20Diagram.png)

## Prototype Notes

- The frontend uses a single-page React app with top-level page switching.
- Shared visual patterns include cards, rounded panels, filters, and simple forms.
- The prototype intentionally keeps interactions straightforward instead of modeling a full enterprise LMS.

## Key Screens

- Authentication: sign up and sign in
- Student home: summary of classes, GPA, and upcoming assignments
- Teacher home: class summary and announcements overview
- Announcements/reminders: filtered by class
- Materials: filtered by class, teacher-posted resources
- Calendar: assignment and reminder visibility
- Grades: student grade view and teacher class performance view
