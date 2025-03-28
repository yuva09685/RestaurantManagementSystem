import { relations } from "drizzle-orm/relations";
import { roles, rolesPermissions, permissions, users } from "./schema";

export const rolesPermissionsRelations = relations(rolesPermissions, ({one}) => ({
	role: one(roles, {
		fields: [rolesPermissions.roleId],
		references: [roles.id]
	}),
	permission: one(permissions, {
		fields: [rolesPermissions.permissionId],
		references: [permissions.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	rolesPermissions: many(rolesPermissions),
	users: many(users),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolesPermissions: many(rolesPermissions),
}));

export const usersRelations = relations(users, ({one}) => ({
	role: one(roles, {
		fields: [users.roleId],
		references: [roles.id]
	}),
}));