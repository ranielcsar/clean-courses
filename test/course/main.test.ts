import { CategoryEnum, StatusEnum } from "@/domain/enum"
import { CreateNewCourse, GetCourse, UpdateCourse } from "@/app/usecases/course"
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

let createCourse: CreateNewCourse
let getCourse: GetCourse
let updateCourse: UpdateCourse
let courseRepo: CourseRepositoryMemory

beforeEach(async () => {
    // const conn = new PgPromiseAdapter()
    courseRepo = new CourseRepositoryMemory()
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
    const createdCourse = await getCourse.execute(outputCreate.courseId)
    expect(createdCourse?.getName()).toBe(input.name)
    expect(createdCourse?.getCategory()).toBe(input.category)
    expect(createdCourse?.getStatus()).toBe(input.status)
})

test("Deve listar cursos", async () => {
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
    expect(updatedCourse?.getName()).toBe(input.name)
    expect(updatedCourse?.getCategory()).toBe(input.category)
    expect(updatedCourse?.getStatus()).toBe(input.status)
})
