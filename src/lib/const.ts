export const userEnumRole = ['super_admin', 'subscriber'] as const
export type UserRole = (typeof userEnumRole)[number]
