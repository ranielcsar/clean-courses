import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { Lesson } from "@/domain/lesson"
import { CourseRepository } from "@/infra/repository/course-repository"

export class CreateNewCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(input: Input): Promise<Output> {
        return this.courseRepository.create(input)
    }
}

type Input = {
    name: string
    category: CategoryEnum
    status: StatusEnum
    lessons: Lesson[]
}

type Output = {
    courseId: string
}
