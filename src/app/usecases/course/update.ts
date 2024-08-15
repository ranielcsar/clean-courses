import { Course } from "@/domain/course"
import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { Lesson } from "@/domain/lesson"
import { CourseRepository } from "@/infra/repository/course-repository"

export class UpdateCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(id: string, input: Input): Promise<boolean> {
        const course = Course.restore(
            id,
            input.name,
            input.category,
            input.status,
            input.lessons
        )
        return this.courseRepository.update(id, course)
    }
}

type Input = {
    name: string
    category: CategoryEnum
    status: StatusEnum
    lessons: Lesson[]
}
