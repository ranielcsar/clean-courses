import { Course } from "@/domain/course"
import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { Lesson } from "@/domain/lesson"
import { CourseRepository } from "@/infra/repository/course-repository"

export class CreateNewCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(input: Input): Promise<any> {
        const course = Course.create(input.name, input.category, input.status)
        await this.courseRepository.create(course)
        return { courseId: course.getId() }
    }
}

type Input = {
    name: string
    category: CategoryEnum
    status: StatusEnum
    lessons: Lesson[]
}
