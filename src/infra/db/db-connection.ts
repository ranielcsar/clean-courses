import pgp from "pg-promise"

export default interface DatabaseConnection {
    query(statement: string, params: any): Promise<any>
    close(): Promise<void>
}

export class PgPromiseAdapter implements DatabaseConnection {
    connection: any

    constructor() {
        this.connection = pgp()("postgres://postgres:123@localhost:5432/courses_db")
    }

    query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params)
    }

    close(): Promise<void> {
        return this.connection.$pool.end()
    }
}
