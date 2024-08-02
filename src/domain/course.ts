import crypto from "crypto"

import { CategoryEnum, StatusEnum } from "./enum"
import { Lesson } from "./lesson"

export class Course {
    constructor(
        private courseId: string,
        private name: string,
        private category: CategoryEnum,
        private status: StatusEnum,
        private lessons: Lesson[] = []
    ) {}

    static create(
        name: string,
        category: CategoryEnum,
        status: StatusEnum,
        lessons: Lesson[] = []
    ) {
        const id = crypto.randomUUID()
        return new Course(id, name, category, status, lessons)
    }

    static restore(
        courseId: string,
        name: string,
        category: CategoryEnum,
        status: StatusEnum,
        lessons: Lesson[] = []
    ) {
        return new Course(courseId, name, category, status, lessons)
    }

    getId() {
        return this.courseId
    }

    getName() {
        return this.name
    }

    getCategory() {
        return this.category
    }

    getStatus() {
        return this.status
    }

    getLessons() {
        return this.lessons
    }
}
