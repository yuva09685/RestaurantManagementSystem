import { pgTable, uuid, serial, text } from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(), // ✅ No identity, using UUID
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role_id: uuid("role_id").notNull().references(() => roles.id),
});

// Roles Table
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

// Permissions Table
export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

// Roles_Permissions Table (Many-to-Many Relationship)
export const rolesPermissions = pgTable("roles_permissions", {
  id: serial("id").primaryKey(), // ✅ Serial for incremental ID
  role_id: uuid("role_id").notNull().references(() => roles.id),
  permission_id: uuid("permission_id").notNull().references(() => permissions.id),
});
