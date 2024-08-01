import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { Lesson } from "@/domain/lesson"
import { CourseRepository } from "@/infra/repository/course-repository"

export class GetCourse {
    constructor(readonly courseRepository: CourseRepository) {}

    async execute(id: string): Promise<Output> {
        return (await this.courseRepository.get(id)) as Output
    }
}

type Output = {
    name: string
    category: CategoryEnum
    status: StatusEnum
    lessons: Lesson[]
}
