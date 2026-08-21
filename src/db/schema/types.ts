import type { userTable } from '#/db/schema/auth-schema.server.ts'
import type { InferInsertModel } from 'drizzle-orm'

export type UserInsert = InferInsertModel<typeof userTable>
