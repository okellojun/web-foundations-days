CREATE TABLE students(
    studentId INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    studentEmail TEXT NOT NULL UNIQUE
);

CREATE TABLE courses(
    courseId INTEGER PRIMARY KEY AUTOINCREMENT,
    courseCode TEXT NOT NULL UNIQUE,
    courseName TEXT NOT NULL,
    courseDescription TEXT NOT NULL
);

CREATE TABLE enrolments(
    enrolmentId INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId INTEGER NOT NULL,
    courseId INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (studentId) REFERENCES students (studentId) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES courses (courseId) ON DELETE CASCADE,
    UNIQUE (studentId, courseId)
);

INSERT INTO students(firstName, lastName, studentEmail) VALUES
('John', 'Otieno', 'otienoj@gmail.com'),
('Mary', 'Wanjiku', 'wanjikumary@gmail.com'),
('Mike', 'Wamalwa', 'wamalwam@gmail.com'),
('Leister', 'Odhiambo', 'lodhiambo@gmail.com'),
('Owala', 'John','johnowala@gmail.con');

INSERT INTO courses(courseCode,courseName,courseDescription) VALUES
('CS201','COMPUTER SCIENCE','CS course covers the study of computers, computational systems, software, and data structures'),
('DB101', 'DATABASE MANAGEMENT SYSTEM', 'Introduction to relational databases and SQL'),
('WEB089', 'WEB DEVELOPMENT', 'Fundamentals of building web applications'),
('NET600', 'NETWORKING AND DISTRIBUTED SYSTEMS', 'IntroduCtions to computer networking'),
('SE478', 'SOFTWARE ENGINEERING', 'Introduction on how to build scalable and secure applications');

INSERT INTO enrolments(studentId,courseId,grade) VALUES
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 1, 'B'),
(2, 3, 'A-'),
(3, 2, 'A'),
(3, 1, 'C');

--all courses for one student (by name),
SELECT 
    s.firstName,
    s.lastName,
    c.coursecode,
    c.courseName,
    e.grade
FROM students s
JOIN enrolments e ON s.studentId = e.studentId
JOIN courses c ON e.courseId = c.courseId
WHERE s.firstName = 'John' AND s.lastName = 'Otieno';

--all students on one course,
SELECT 
    c.coursecode,
    c.courseName,
    s.firstName,
    s.lastName,
    s.studentEmail,
    e.grade
FROM courses c
JOIN enrolments e ON c.courseId = e.courseId
JOIN students s ON e.studentId = s.studentId
WHERE c.courseCode = 'CS201';

--the number of students per course
SELECT 
    c.courseCode,
    c.courseName,
    COUNT(e.studentId) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.courseId = e.courseId
GROUP BY c.courseId, c.courseCode, c.courseName;

--students who have no enrolments
SELECT 
    s.studentId,
    s.firstName,
    s.lastName,
    s.studentEmail
FROM students s
LEFT JOIN enrolments e ON s.studentId = e.studentId
WHERE e.enrolmentId IS NULL;

-- update of one enrolment's grade
UPDATE enrolments
SET grade = 'A'
WHERE studentId = (SELECT studentId FROM students WHERE studentEmail = 'wanjikumary@gmail.com')
  AND courseId = (SELECT courseId FROM courses WHERE courseCode = 'CS201');

-- view the updated grade
SELECT 
    s.firstName,
    s.lastName,
    c.courseCode,
    e.grade
FROM enrolments e
JOIN students s ON e.studentId = s.studentId
JOIN courses c ON e.courseId = c.courseId
WHERE s.studentEmail = 'wanjikumary@gmail.com' AND c.courseCode = 'CS201';