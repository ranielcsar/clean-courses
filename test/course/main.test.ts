import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { CreateNewCourse, GetCourse, UpdateCourse } from "@/app/usecases/course"
import {
    CourseRepositoryMemory,
    CourseRepositoryDb,
} from "@/infra/repository/course-repository"
import { PgPromiseAdapter } from "@/infra/db/db-connection"

function randomValueFromEnum(enumarator: Record<string, string>) {
    let key: string | string[] = Object.keys(enumarator)
    key = key[Math.floor(Math.random() * 1)]
    return enumarator[key]
}

let createCourse: CreateNewCourse
let getCourse: GetCourse
let updateCourse: UpdateCourse

beforeEach(async () => {
    const conn = new PgPromiseAdapter()
    const courseRepo = new CourseRepositoryDb(conn)
    createCourse = new CreateNewCourse(courseRepo)
    getCourse = new GetCourse(courseRepo)
    updateCourse = new UpdateCourse(courseRepo)
})

test("Deve criar um novo curso", async () => {
    const input = {
        name: `Curso ${Math.floor(Math.random() * 1200)}`,
        category: randomValueFromEnum(CategoryEnum) as CategoryEnum,
        status: randomValueFromEnum(StatusEnum) as StatusEnum,
        lessons: [],
    }
    const outputCreate = await createCourse.execute(input)
    expect(outputCreate.courseId).toBeDefined()
})

test("Deve listar cursos", async () => {
    const conn = new PgPromiseAdapter()
    const courseRepo = new CourseRepositoryDb(conn)
    const outputList = await courseRepo.list()
    expect(Array.isArray(outputList)).toBe(true)
})

test("Deve atualizar um curso existente", async () => {
    const input = {
        name: `Curso ${Math.floor(Math.random() * 1200)}`,
        category: randomValueFromEnum(CategoryEnum) as CategoryEnum,
        status: randomValueFromEnum(StatusEnum) as StatusEnum,
        lessons: [],
    }
    const outputCreate = await createCourse.execute(input)
    expect(outputCreate.courseId).toBeDefined()

    input.name = `Curso ${Math.floor(Math.random() * 1200)}`
    await updateCourse.execute(outputCreate.courseId, input)
    const updatedCourse = await getCourse.execute(outputCreate.courseId)
    expect(updatedCourse.name).toBe(input.name)
    expect(updatedCourse.category).toBe(input.category)
    expect(updatedCourse.status).toBe(input.status)
})
