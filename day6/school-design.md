# School System Database Design Explanation

## Students Table

The `students` table stores one record for each student. It contains a unique `studentId` primary key, students first and last Name, and their email addresses, all of which cannot be NULL. The email is `NOT NULL` and `UNIQUE` so that every student must have an email and two students cannot use the same email address.

## Courses Table

The `courses` table stores the courses offered by the school. Each course has a unique `courseId` primary key, a required Course name and course description

## Enrolments Table

The `enrolments` table represents the fact that a student a student is enrolled on a course. It stores the `studentId`, `courseId`, and the student's grade for
that course.
A student can enroll on many courses, and a course can have many students.
Therefore, the relationship between students and courses is **many-to-many**.
The `enrolments` table is needed as a join table to represent this
relationship. It also stores information that belongs to the relationship
itself, the student's grade on that course.

Each student can have many enrolments, so the relationship from `students` to
`enrolments` is **one-to-many**. Similarly, one course can have many
enrolments, so the relationship from `courses` to `enrolments` is also
**one-to-many**.

The `enrolments` table uses a composite primary key consisting of
`studentId` and `courseId`. This prevents the same student from being
enrolled on the same course more than once. The two columns are also foreign
keys referencing their respective parent tables.


## Index

I would add an index on `enrolments(courseId)`. Queries that find all
students enrolled on a particular course, or count students per course,
frequently search or group by `courseId`. An index can make those operations
more efficient as the number of enrolments grows.

For example:

```sql
CREATE INDEX idx_enrolments_courseId
ON enrolments(courseId);

## SQL or NoSQL


For an academic database management system, SQL is the optimal choice because it naturally handles the clear, structured relationships between students, courses, and grades using tables and joins. It ensures strict data integrity, schema enforcement, and ACID compliance (via primary/foreign keys, unique constraints, and transactions) to protect against issues like double enrolments or data duplication, making straightforward work of aggregations and queries that NoSQL databases would struggle to maintain efficiently.