import { Course } from "@/domain/course"
import DatabaseConnection from "@/infra/db/db-connection"
import crypto from "crypto"

export interface CourseRepository {
    create(input: Course): Promise<boolean>
    list(): Promise<Course[]>
    get(id: string): Promise<Course | undefined>
    update(id: string, input: Course): Promise<boolean>
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

    async list(): Promise<Course[]> {
        const courses = await this.connection.query(
            "SELECT * FROM courses.course LIMIT 10",
            []
        )
        this.connection.close()
        return courses.map((c: any) =>
            Course.restore(c.course_id, c.name, c.category, c.status, c.lessons)
        )
    }

    async get(id: string): Promise<Course | undefined> {
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

    async update(id: string, input: any): Promise<boolean> {
        try {
            await this.connection.query(
                "UPDATE courses.course SET name = $1, category = $2, status = $3 WHERE course_id = $4",
                [input.name, input.category, input.status, id]
            )
            // this.connection.close()
            return true
        } catch {
            return false
        }
        // this.connection.close()
    }
}

export class CourseRepositoryMemory implements CourseRepository {
    courses = [] as Course[]

    async create(input: Course): Promise<boolean> {
        this.courses.push(input)
        return true
    }

    async list(): Promise<any> {
        return this.courses
    }

    async get(id: string): Promise<Course | undefined> {
        const course: any = this.courses.find((c: any) => {
            if (c.courseId === id) return c
        })
        if (!course) return

        return Course.restore(
            course.courseId,
            course.name,
            course.category,
            course.status,
            course.lessons
        )
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
