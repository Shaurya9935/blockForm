import db from "@repo/database";
import { formsTable } from '@repo/database/models/form'

import { createFormInput, createFormInputType } from "./model";


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

    
}


export default FormService