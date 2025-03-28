import { pgTable, unique, uuid, text, foreignKey, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const permissions = pgTable("permissions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("permissions_name_unique").on(table.name),
]);

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
}, (table) => [
	unique("roles_name_unique").on(table.name),
]);

export const rolesPermissions = pgTable("roles_permissions", {
	id: serial().primaryKey().notNull(),
	roleId: uuid("role_id").notNull(),
	permissionId: uuid("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "roles_permissions_role_id_roles_id_fk"
		}),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "roles_permissions_permission_id_permissions_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	roleId: uuid("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "users_role_id_roles_id_fk"
		}),
	unique("users_email_unique").on(table.email),
]);
