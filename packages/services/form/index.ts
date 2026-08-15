import db, { asc, eq } from "@repo/database";
import { formsTable } from '@repo/database/models/form'
import { formFieldsTable } from '@repo/database/models/form-field'

import {
  createFormInput,
  createFormInputType,
  updateFormInput,
  UpdateFormInputType,
  getFormByIdInput,
  GetFormByIdInputType,
  listFormsByUserIdInput,
  listFormsByUserIdInputType,
} from "./model";

class FormService {
  public async createForm(payload: createFormInputType) {
    const { title, description, theme, createdBy } = await createFormInput.parseAsync(payload);

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        description: description ?? null,
        theme: theme ?? 'overworld',
        createdBy,
      })
      .returning({
        id: formsTable.id,
      })

    if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
      throw new Error('Something went wrong while creating form')
    }

    return { id: formInsertResult[0]?.id }
  }

  public async updateForm(payload: UpdateFormInputType) {
    const { formId, title, description, theme } = await updateFormInput.parseAsync(payload);

    const updateValues: Record<string, any> = {}
    if (title !== undefined) updateValues.title = title
    if (description !== undefined) updateValues.description = description
    if (theme !== undefined) updateValues.theme = theme

    if (Object.keys(updateValues).length === 0) {
      throw new Error('No values provided for update')
    }

    const updated = await db
      .update(formsTable)
      .set(updateValues)
      .where(eq(formsTable.id, formId))
      .returning({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        theme: formsTable.theme,
      })

    if (!updated || updated.length === 0) {
      throw new Error('Form not found or update failed')
    }

    return updated[0]!
  }

  public async listFormsByUserId(payload: listFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        theme: formsTable.theme,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId))

    return forms
  }

  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload)

    const rows = await db
      .select({
        formId: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        theme: formsTable.theme,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
        fieldId: formFieldsTable.id,
        fieldLabel: formFieldsTable.label,
        fieldLabelKey: formFieldsTable.labelKey,
        fieldType: formFieldsTable.type,
        fieldDescription: formFieldsTable.description,
        fieldPlaceholder: formFieldsTable.placeholder,
        fieldIsRequired: formFieldsTable.isRequired,
        fieldIndex: formFieldsTable.index,
        fieldConfig: formFieldsTable.config,
        fieldWorkflowX: formFieldsTable.workflowX,
        fieldWorkflowY: formFieldsTable.workflowY,
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formsTable.id, formFieldsTable.formId))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index))

    if (!rows || rows.length === 0) {
      return null
    }

    const firstRow = rows[0]!

    const fields = rows
      .filter((row) => row.fieldId !== null)
      .map((row) => ({
        id: row.fieldId!,
        label: row.fieldLabel!,
        labelKey: row.fieldLabelKey!,
        type: row.fieldType!,
        description: row.fieldDescription ?? null,
        placeholder: row.fieldPlaceholder ?? null,
        isRequired: row.fieldIsRequired!,
        index: row.fieldIndex!,
        config: row.fieldConfig ?? null,
        workflowX: row.fieldWorkflowX ?? null,
        workflowY: row.fieldWorkflowY ?? null,
      }))

    return {
      id: firstRow.formId,
      title: firstRow.title,
      description: firstRow.description ?? null,
      theme: firstRow.theme ?? 'overworld',
      createdAt: firstRow.createdAt,
      updatedAt: firstRow.updatedAt,
      fields,
    }
  }
}

export default FormService