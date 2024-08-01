import { Course } from "@/domain/course"
import DatabaseConnection from "@/infra/db/db-connection"
import crypto from "crypto"

export interface CourseRepository {
    create(input: any): Promise<any>
    list(): Promise<any>
    get(id: string): Promise<any>
}

export class CourseRepositoryDb implements CourseRepository {
    constructor(readonly connection: DatabaseConnection) {}

    async create(input: any): Promise<any> {
        const course = Course.create(input.name, input.category, input.status)
        await this.connection.query(
            "INSERT INTO courses.course (course_id, name, category, status) values ($1, $2, $3, $4)",
            [course.getId(), course.getName(), course.getCategory(), course.getStatus()]
        )
        return {
            courseId: course.getId(),
        }
    }

    async list(): Promise<any> {
        const courses = await this.connection.query(
            "SELECT * FROM courses.course LIMIT 10",
            []
        )
        return courses.map((c: any) =>
            Course.restore(c.course_id, c.name, c.category, c.status, c.lessons)
        )
    }

    async get(id: string): Promise<any> {
        const [course] = await this.connection.query(
            "SELECT * FROM courses.course WHERE course_id = $1",
            [id]
        )
        if (!course) return
        return Course.restore(
            course.course_id,
            course.name,
            course.category,
            course.status,
            course.lessons
        )
    }
}

export class CourseRepositoryMemory implements CourseRepository {
    courses: any[] = []

    async create(input: any): Promise<any> {
        const courseId = crypto.randomUUID()
        this.courses.push({ ...input, courseId })
        return { courseId }
    }

    async list(): Promise<any> {
        return this.courses
    }

    async get(id: string): Promise<any> {
        const course = this.courses.find((c) => c.courseId === id)
        return course
    }
}
