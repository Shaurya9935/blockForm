import { z } from "zod";

export const fieldTypeEnum = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);
export type FieldType = z.infer<typeof fieldTypeEnum>;

export const createFormFieldInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
  label: z.string().min(1, "Label is required").max(100, "Label cannot exceed 100 characters"),
  labelKey: z
    .string()
    .min(1, "Label key is required")
    .max(100, "Label key cannot exceed 100 characters"),
  description: z
    .string()
    .max(300, "Description cannot exceed 300 characters")
    .optional()
    .default(""),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().optional().default(false),
  index: z.string().describe("Fractional index for ordering"),
  type: fieldTypeEnum,
});

export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;

export const bulkCreateFormFieldsInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
  fields: z.array(
    z.object({
      label: z.string().min(1, "Label is required").max(100),
      labelKey: z.string().min(1, "Label key is required").max(100),
      description: z.string().max(300).optional().default(""),
      placeholder: z.string().optional().nullable(),
      isRequired: z.boolean().optional().default(false),
      index: z.string(),
      type: fieldTypeEnum,
    }),
  ),
});

export type BulkCreateFormFieldsInputType = z.infer<typeof bulkCreateFormFieldsInput>;

export const listFormFieldsByFormIdInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export type ListFormFieldsByFormIdInputType = z.infer<typeof listFormFieldsByFormIdInput>;

export const getFormFieldByIdInput = z.object({
  id: z.string().uuid("Invalid field ID"),
});

export type GetFormFieldByIdInputType = z.infer<typeof getFormFieldByIdInput>;

export const updateFormFieldInput = z.object({
  id: z.string().uuid("Invalid field ID"),
  label: z.string().min(1).max(100).optional(),
  labelKey: z.string().min(1).max(100).optional(),
  description: z.string().max(300).optional(),
  placeholder: z.string().optional().nullable(),
  isRequired: z.boolean().optional(),
  index: z.string().optional(),
  type: fieldTypeEnum.optional(),
});

export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;

export const deleteFormFieldInput = z.object({
  id: z.string().uuid("Invalid field ID"),
});

export type DeleteFormFieldInputType = z.infer<typeof deleteFormFieldInput>;
