DROP SCHEMA courses cascade;

CREATE SCHEMA courses;

CREATE TABLE courses.course (
    course_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE courses.lesson (
    lesson_id UUID PRIMARY KEY,
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses.course(course_id)
);
