import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  unique
} from "drizzle-orm/pg-core";
import { usersTable } from "./user";


export const accountsTable = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: uuid('user_id').references(()=> usersTable.id).notNull(),

  provider: varchar('provider', {length: 50}).notNull(),
  providerAccountId: text('provider_account_id').notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
},(table) => [
    unique('accounts_provider_account_id_unique').on(table.provider, table.providerAccountId)
])