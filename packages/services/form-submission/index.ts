import db, { asc, desc, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formSubmissionTable } from "@repo/database/models/form-submission";
import {
  deleteSubmissionInput,
  DeleteSubmissionInputType,
  getFormSubmissionByIdInput,
  GetFormSubmissionByIdInputType,
  listFormSubmissionsForCreatorInput,
  ListFormSubmissionsForCreatorInputType,
  listSubmissionsByFormIdInput,
  ListSubmissionsByFormIdInputType,
  submitFormInput,
  SubmitFormInputType,
} from "./model";

class FormSubmissionService {
  public async submitForm(payload: SubmitFormInputType) {
    const { formId, values } = await submitFormInput.parseAsync(payload);

    const existingForm = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!existingForm || existingForm.length === 0) {
      throw new Error(`Form with id: ${formId} does not exist`);
    }

    const insertResult = await db
      .insert(formSubmissionTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formSubmissionTable.id,
        createdAt: formSubmissionTable.createdAt,
      });

    if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
      throw new Error("Something went wrong while saving form submission");
    }

    return {
      id: insertResult[0].id,
      createdAt: insertResult[0].createdAt,
    };
  }

  public async getSubmissionById(payload: GetFormSubmissionByIdInputType) {
    const { id } = await getFormSubmissionByIdInput.parseAsync(payload);

    const result = await db
      .select()
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.id, id));

    if (!result || result.length === 0) {
      throw new Error(`Submission with id: ${id} does not exist`);
    }

    return result[0]!;
  }

  public async listSubmissionsByFormId(payload: ListSubmissionsByFormIdInputType) {
    const { formId } = await listSubmissionsByFormIdInput.parseAsync(payload);

    const submissions = await db
      .select()
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formId))
      .orderBy(desc(formSubmissionTable.createdAt));

    return submissions;
  }

  public async listFormSubmissionsForCreator(payload: ListFormSubmissionsForCreatorInputType) {
    const { formId, userId } = await listFormSubmissionsForCreatorInput.parseAsync(payload);

    const formRows = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
      })
      .from(formsTable)
      .where(eq(formsTable.id, formId));

    if (!formRows || formRows.length === 0) {
      throw new Error(`Form with id: ${formId} does not exist`);
    }

    const form = formRows[0]!;

    if (form.createdBy !== userId) {
      throw new Error("Unauthorized: Only the creator of this form can view its responses");
    }

    const fields = await db
      .select({
        id: formFieldsTable.id,
        label: formFieldsTable.label,
        labelKey: formFieldsTable.labelKey,
        type: formFieldsTable.type,
        index: formFieldsTable.index,
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));

    const submissions = await db
      .select({
        id: formSubmissionTable.id,
        formId: formSubmissionTable.formId,
        values: formSubmissionTable.values,
        createdAt: formSubmissionTable.createdAt,
        updatedAt: formSubmissionTable.updatedAt,
      })
      .from(formSubmissionTable)
      .where(eq(formSubmissionTable.formId, formId))
      .orderBy(desc(formSubmissionTable.createdAt));

    return {
      form: {
        id: form.id,
        title: form.title,
        description: form.description ?? null,
      },
      fields,
      submissions,
    };
  }

  public async deleteSubmission(payload: DeleteSubmissionInputType) {
    const { id } = await deleteSubmissionInput.parseAsync(payload);

    const deleted = await db
      .delete(formSubmissionTable)
      .where(eq(formSubmissionTable.id, id))
      .returning({ id: formSubmissionTable.id });

    if (!deleted || deleted.length === 0) {
      throw new Error(`Submission with id: ${id} does not exist or was already deleted`);
    }

    return { id: deleted[0]!.id, success: true };
  }
}

export default FormSubmissionService;
