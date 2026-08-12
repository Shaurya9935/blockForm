import db, { eq } from "@repo/database";
import { formsTable } from '@repo/database/models/form'

import { createFormInput, createFormInputType, listFormsByUserIdInput, listFormsByUserIdInputType } from "./model";


class FormService { 
    public async createForm(payload: createFormInputType) {
        const { title, description, createdBy } = await createFormInput.parseAsync(payload);

        const formInsertResult = await db
        .insert(formsTable)
        .values({
            title,
            description: description ?? null,
            createdBy,
        })
        .returning({
            id: formsTable.id
        })
        
        if(!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) throw new Error('Something went wrong while creating form')

        return {id: formInsertResult[0]?.id}
    }

    public async listFormsByUserId(payload: listFormsByUserIdInputType) {
        const { userId } = await listFormsByUserIdInput.parseAsync(payload);


        const forms = await db
        .select({
            id: formsTable.id,
            title: formsTable.title,
            description: formsTable.description,
            createdAt: formsTable.createdAt,
            updatedAt: formsTable.updatedAt
        })
        .from(formsTable)
        .where(eq(formsTable.createdBy, userId)) 

        return forms
    }
}


export default FormService