import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { Lesson } from "@/domain/lesson"
import { CourseRepository } from "@/infra/repository/course-repository"

export class UpdateCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(id: string, input: Input): Promise<void> {
        return this.courseRepository.update(id, input)
    }
}

type Input = {
    name: string
    category: CategoryEnum
    status: StatusEnum
    lessons: Lesson[]
}
