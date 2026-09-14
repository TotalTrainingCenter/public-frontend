import { createMongoAbility } from '@casl/ability'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

// ex: Post, Comment, User, etc. We haven't used any of these in our demo though.
export type Subjects = 'INFORMATION' | 'BOARD' | 'COMMON' | 'COMMENT' | 'all'

export const ability = createMongoAbility<[Actions, Subjects]>()
