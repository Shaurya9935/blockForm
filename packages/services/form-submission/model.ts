import { z } from "zod";

export const formSubmissionValueSchema = z.object({
  formFieldId: z.string().describe("ID of the form field"),
  value: z.string().describe("Submitted value for the form field"),
});

export type FormSubmissionValueType = z.infer<typeof formSubmissionValueSchema>;

export const submitFormInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
  values: z.array(formSubmissionValueSchema).min(1, "At least one field value must be submitted"),
});

export type SubmitFormInputType = z.infer<typeof submitFormInput>;

export const getFormSubmissionByIdInput = z.object({
  id: z.string().uuid("Invalid submission ID"),
});

export type GetFormSubmissionByIdInputType = z.infer<typeof getFormSubmissionByIdInput>;

export const listSubmissionsByFormIdInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
});

export type ListSubmissionsByFormIdInputType = z.infer<typeof listSubmissionsByFormIdInput>;

export const listFormSubmissionsForCreatorInput = z.object({
  formId: z.string().uuid("Invalid form ID"),
  userId: z.string().uuid("Invalid user ID"),
});

export type ListFormSubmissionsForCreatorInputType = z.infer<typeof listFormSubmissionsForCreatorInput>;

export const deleteSubmissionInput = z.object({
  id: z.string().uuid("Invalid submission ID"),
});

export type DeleteSubmissionInputType = z.infer<typeof deleteSubmissionInput>;
