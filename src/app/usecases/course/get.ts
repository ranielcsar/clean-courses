import { Course } from "@/domain/course"
import { CourseRepository } from "@/infra/repository/course-repository"

export class GetCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(id: string): Promise<Course | undefined> {
        return await this.courseRepository.get(id)
    }
}
