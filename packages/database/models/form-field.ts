import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
  numeric,
  pgEnum,
  unique,
  json,
  real,
} from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export const fieldTypeEnum = pgEnum('field_type_enum', [
  'TEXT',
  'NUMBER',
  'EMAIL',
  'YES_NO',
  'PASSWORD',
  'SELECT',
  'CHECKBOX',
  'RATING',
  'DATE',
])

export interface FieldConfig {
  options?: { id: string; value: string }[]  // for SELECT, CHECKBOX
  maxRating?: number                          // for RATING
  minValue?: number                           // for NUMBER
  maxValue?: number                           // for NUMBER
  minLength?: number                          // for TEXT
  maxLength?: number                          // for TEXT
  errorMessage?: string                       // custom validation message
}

export const formFieldsTable = pgTable('form_field_table', {
    id: uuid('id').primaryKey().defaultRandom(),

    label: varchar('label', {length: 100}).notNull(),
    labelKey: varchar('label_key', {length: 100}).notNull(),

    description: varchar('description', {length: 300}).notNull(),

    placeholder: text('placeholder'),

    isRequired: boolean('isRequired').default(false).notNull(),

    index: numeric('index', {scale: 2}).notNull(),

    type: fieldTypeEnum('type').notNull(),

    config: json('config').$type<FieldConfig>(),

    // Workflow node positions (null = auto-layout)
    workflowX: real('workflow_x'),
    workflowY: real('workflow_y'),

    formId: uuid('form_id').references(() => formsTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),

}, (table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})