import db, { asc, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import {
  bulkCreateFormFieldsInput,
  BulkCreateFormFieldsInputType,
  createFormFieldInput,
  CreateFormFieldInputType,
  deleteFormFieldInput,
  DeleteFormFieldInputType,
  getFormFieldByIdInput,
  GetFormFieldByIdInputType,
  listFormFieldsByFormIdInput,
  ListFormFieldsByFormIdInputType,
  updateFormFieldInput,
  UpdateFormFieldInputType,
} from "./model";

class FormFieldService {
  public async createFormField(payload: CreateFormFieldInputType) {
    const {
      formId,
      label,
      labelKey,
      description,
      placeholder,
      isRequired,
      index,
      type,
    } = await createFormFieldInput.parseAsync(payload);

    const result = await db
      .insert(formFieldsTable)
      .values({
        formId,
        label,
        labelKey,
        description: description ?? "",
        placeholder: placeholder ?? null,
        isRequired: isRequired ?? false,
        index,
        type,
      })
      .returning({
        id: formFieldsTable.id,
      });

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error("Something went wrong while creating form field");
    }

    return { id: result[0].id };
  }

  public async bulkCreateFormFields(payload: BulkCreateFormFieldsInputType) {
    const { formId, fields } = await bulkCreateFormFieldsInput.parseAsync(payload);

    return await db.transaction(async (tx) => {
      // Delete existing form fields for this form first so saving replaces the workflow fields cleanly
      await tx.delete(formFieldsTable).where(eq(formFieldsTable.formId, formId));

      if (fields.length === 0) return [];

      const valuesToInsert = fields.map((field) => ({
        formId,
        label: field.label,
        labelKey: field.labelKey,
        description: field.description ?? "",
        placeholder: field.placeholder ?? null,
        isRequired: field.isRequired ?? false,
        index: field.index,
        type: field.type,
        config: field.config ?? null,
        workflowX: field.workflowX ?? null,
        workflowY: field.workflowY ?? null,
      }));

      const insertedFields = await tx
        .insert(formFieldsTable)
        .values(valuesToInsert)
        .returning();

      return insertedFields;
    });
  }

  public async listFormFieldsByFormId(payload: ListFormFieldsByFormIdInputType) {
    const { formId } = await listFormFieldsByFormIdInput.parseAsync(payload);

    const fields = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));

    return fields;
  }

  public async getFormFieldById(payload: GetFormFieldByIdInputType) {
    const { id } = await getFormFieldByIdInput.parseAsync(payload);

    const result = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id));

    if (!result || result.length === 0) {
      throw new Error(`Form field with id: ${id} does not exist`);
    }

    return result[0]!;
  }

  public async updateFormField(payload: UpdateFormFieldInputType) {
    const validated = await updateFormFieldInput.parseAsync(payload);
    const { id, ...updates } = validated;

    const existing = await this.getFormFieldById({ id });
    if (!existing) {
      throw new Error(`Form field with id: ${id} does not exist`);
    }

    const updated = await db
      .update(formFieldsTable)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(formFieldsTable.id, id))
      .returning();

    return updated[0]!;
  }

  public async deleteFormField(payload: DeleteFormFieldInputType) {
    const { id } = await deleteFormFieldInput.parseAsync(payload);

    const deleted = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning({ id: formFieldsTable.id });

    if (!deleted || deleted.length === 0) {
      throw new Error(`Form field with id: ${id} does not exist or was already deleted`);
    }

    return { id: deleted[0]!.id, success: true };
  }
}

export default FormFieldService;
