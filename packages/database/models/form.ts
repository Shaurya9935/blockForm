import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";

export const formThemeEnum = pgEnum("form_theme", [
  "default",
  "overworld",
  "nether",
  "aura",
  "end",
  "diamond",
  "cyberpunk",
  "retro",
]);



export const formsTable = pgTable('forms_table', {
    id: uuid('id').primaryKey().defaultRandom(),

    title: varchar('title', {length: 50}).notNull(),
    description: varchar('description', {length: 300}),

    createdBy: uuid('created_by').references(()=> usersTable.id),

    theme: formThemeEnum("theme")
  .notNull()
  .default("overworld"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
})