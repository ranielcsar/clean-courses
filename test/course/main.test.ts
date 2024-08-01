import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { CreateNewCourse } from "@/app/usecases/course/create"
import { GetCourse } from "@/app/usecases/course/get"
import {
    CourseRepositoryMemory,
    // CourseRepositoryDb,
} from "@/infra/repository/course-repository"
// import { PgPromiseAdapter } from "@/infra/db/db-connection"

function randomValueFromEnum(enumarator: Record<string, string>) {
    let key: string | string[] = Object.keys(enumarator)
    key = key[Math.floor(Math.random() * 1)]
    return enumarator[key]
}

// const conn = new PgPromiseAdapter()
// afterAll(async () => {
//     await conn.close()
// })

test("Deve criar um novo curso", async () => {
    const courseRepo = new CourseRepositoryMemory()
    const createCourse = new CreateNewCourse(courseRepo)
    const getCourse = new GetCourse(courseRepo)
    const input = {
        name: `Curso ${Math.floor(Math.random() * 1200)}`,
        category: randomValueFromEnum(CategoryEnum) as CategoryEnum,
        status: randomValueFromEnum(StatusEnum) as StatusEnum,
        lessons: [],
    }
    const outputCreate = await createCourse.execute(input)
    expect(outputCreate.courseId).toBeDefined()
    const newCourse = await getCourse.execute(outputCreate.courseId)
    expect(newCourse.name).toBe(input.name)
    expect(newCourse.category).toBe(input.category)
    expect(newCourse.status).toBe(input.status)
})

test("Deve listar cursos", async () => {
    const courseRepo = new CourseRepositoryMemory()
    const outputList = await courseRepo.list()
    expect(Array.isArray(outputList)).toBe(true)
})
