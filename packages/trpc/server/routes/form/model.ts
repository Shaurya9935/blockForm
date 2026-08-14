import { z } from "zod";

export const createFormInputModel = z.object({
    title: z.string().describe('Title of the form').min(1, 'Title is required').max(55, 'title cannot be exceed 55 charcters'),
    description: z.string().describe('Description of the form').max(300, 'Description cannot be exceed 300 characters').optional()
})

export const createFormOutputModel = z.object({
    id: z.string().describe('uuid of the created form')
})

export const listMyFormsInputModel = z.object({
    userId: z.string().describe('uuid of the user who created form').optional()
}).optional()

export const listMyFormsOutputModel = z.array(
    z.object({
        id: z.string().uuid().describe('id of the form'),
        title: z.string().describe('title of the form'),
        description: z.string().nullable().optional().describe('description of the form'),
        createdAt: z.date().optional().nullable().describe('Creation timestamp'),
        updatedAt: z.date().optional().nullable().describe('Last Updated timestamp')
    })
)

// Form Fields Object & Enums

export const fieldTypeEnum = z.enum([
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

export const formFieldObject = z.object({
    id: z.string().describe('ID of the field'),
    label: z.string().describe('Display label'),
    labelKey: z.string().describe('Immutable slug key'),
    type: fieldTypeEnum,
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    index: z.string().describe('Fractional index for ordering'),
    config: z.any().optional().nullable(),
    workflowX: z.number().optional().nullable(),
    workflowY: z.number().optional().nullable(),
    formId: z.string().optional().nullable(),
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
})

export const getFormInputModel = z.object({
    formId: z.string().uuid().describe('UUID of the form'),
})

export const getFormOutputModel = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    fields: z.array(formFieldObject),
}).nullable()

// Form Field Procedures Input/Output Models

export const createFormFieldInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
    label: z.string().min(1, 'Label is required').max(100, 'Label cannot exceed 100 characters'),
    labelKey: z.string().min(1, 'Label key is required').max(100, 'Label key cannot exceed 100 characters'),
    description: z.string().max(300, 'Description cannot exceed 300 characters').optional().default(''),
    placeholder: z.string().optional().nullable(),
    isRequired: z.boolean().optional().default(false),
    index: z.string().describe('Fractional index for ordering'),
    type: fieldTypeEnum,
    config: z.any().optional().nullable(),
    workflowX: z.number().optional().nullable(),
    workflowY: z.number().optional().nullable(),
})

export const createFormFieldOutputModel = z.object({
    id: z.string().describe('UUID of the created form field')
})

export const bulkCreateFormFieldsInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
    fields: z.array(
        z.object({
            label: z.string().min(1, 'Label is required').max(100),
            labelKey: z.string().min(1, 'Label key is required').max(100),
            description: z.string().max(300).optional().default(''),
            placeholder: z.string().optional().nullable(),
            isRequired: z.boolean().optional().default(false),
            index: z.string(),
            type: fieldTypeEnum,
            config: z.any().optional().nullable(),
            workflowX: z.number().optional().nullable(),
            workflowY: z.number().optional().nullable(),
        })
    ),
})

export const bulkCreateFormFieldsOutputModel = z.array(formFieldObject)

export const listFormFieldsInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
})

export const listFormFieldsOutputModel = z.array(formFieldObject)

export const getFormFieldInputModel = z.object({
    id: z.string().uuid('Invalid field ID'),
})

export const getFormFieldOutputModel = formFieldObject

export const updateFormFieldInputModel = z.object({
    id: z.string().uuid('Invalid field ID'),
    label: z.string().min(1).max(100).optional(),
    labelKey: z.string().min(1).max(100).optional(),
    description: z.string().max(300).optional(),
    placeholder: z.string().optional().nullable(),
    isRequired: z.boolean().optional(),
    index: z.string().optional(),
    type: fieldTypeEnum.optional(),
    config: z.any().optional().nullable(),
    workflowX: z.number().optional().nullable(),
    workflowY: z.number().optional().nullable(),
})

export const updateFormFieldOutputModel = formFieldObject

export const deleteFormFieldInputModel = z.object({
    id: z.string().uuid('Invalid field ID'),
})

export const deleteFormFieldOutputModel = z.object({
    id: z.string(),
    success: z.boolean(),
})

// Form Submission Procedures Input/Output Models

export const formSubmissionValueObject = z.object({
    formFieldId: z.string().describe('ID of the field'),
    value: z.string().describe('Submitted value'),
})

export const formSubmissionObject = z.object({
    id: z.string().uuid().describe('ID of the submission'),
    formId: z.string().uuid().nullable().describe('ID of the form'),
    values: z.array(formSubmissionValueObject).nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
})

export const submitFormInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
    values: z.array(formSubmissionValueObject).min(1, 'At least one value is required'),
})

export const submitFormOutputModel = z.object({
    id: z.string().describe('UUID of the submission'),
    createdAt: z.date().nullable().optional(),
})

export const listSubmissionsInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
})

export const listSubmissionsOutputModel = z.array(formSubmissionObject)

export const listFormResponsesInputModel = z.object({
    formId: z.string().uuid('Invalid form ID'),
})

export const listFormResponsesOutputModel = z.object({
    form: z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
    }),
    fields: z.array(
        z.object({
            id: z.string(),
            label: z.string(),
            labelKey: z.string(),
            type: fieldTypeEnum,
            index: z.string(),
        })
    ),
    submissions: z.array(formSubmissionObject),
})

export const getSubmissionInputModel = z.object({
    id: z.string().uuid('Invalid submission ID'),
})

export const getSubmissionOutputModel = formSubmissionObject

export const deleteSubmissionInputModel = z.object({
    id: z.string().uuid('Invalid submission ID'),
})

export const deleteSubmissionOutputModel = z.object({
    id: z.string(),
    success: z.boolean(),
})