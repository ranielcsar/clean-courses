import { Course } from "@/domain/course"
import DatabaseConnection from "@/infra/db/db-connection"
import crypto from "crypto"

export interface CourseRepository {
    create(input: any): Promise<boolean>
    list(): Promise<any>
    get(id: string): Promise<any>
    update(id: string, input: any): Promise<any>
}

export class CourseRepositoryDb implements CourseRepository {
    constructor(readonly connection: DatabaseConnection) {}

    async create(input: Course): Promise<boolean> {
        try {
            await this.connection.query(
                "INSERT INTO courses.course (course_id, name, category, status) values ($1, $2, $3, $4)",
                [input.getId(), input.getName(), input.getCategory(), input.getStatus()]
            )
            // this.connection.close()
            return true
        } catch {
            return false
        }
    }

    async list(): Promise<any> {
        const courses = await this.connection.query(
            "SELECT * FROM courses.course LIMIT 10",
            []
        )
        this.connection.close()
        return courses.map((c: any) =>
            Course.restore(c.course_id, c.name, c.category, c.status, c.lessons)
        )
    }

    async get(id: string): Promise<any> {
        const [course] = await this.connection.query(
            "SELECT * FROM courses.course WHERE course_id = $1",
            [id]
        )
        // this.connection.close()
        if (!course) return
        return Course.restore(
            course.course_id,
            course.name,
            course.category,
            course.status,
            course.lessons
        )
    }

    async update(id: string, input: any): Promise<any> {
        await this.connection.query(
            "UPDATE courses.course SET name = $1, category = $2, status = $3 WHERE course_id = $4",
            [input.name, input.category, input.status, id]
        )
        // this.connection.close()
    }
}

export class CourseRepositoryMemory implements CourseRepository {
    courses: Course[] = []

    async create(input: any): Promise<any> {
        const courseId = crypto.randomUUID()
        this.courses.push({ ...input, courseId })
        return { courseId }
    }

    async list(): Promise<any> {
        return this.courses
    }

    async get(id: string): Promise<any> {
        const course = this.courses.find((c) => c.getId() === id)
        return course
    }

    async update(id: string, input: any): Promise<any> {
        this.courses = this.courses.map((c) => {
            if (c.getId() === id) {
                return { courseId: id, ...input }
            }

            return c
        })
    }
}
