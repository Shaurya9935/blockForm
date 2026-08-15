import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  bulkCreateFormFieldsInputModel,
  bulkCreateFormFieldsOutputModel,
  createFormFieldInputModel,
  createFormFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFormFieldInputModel,
  deleteFormFieldOutputModel,
  deleteSubmissionInputModel,
  deleteSubmissionOutputModel,
  getFormFieldInputModel,
  getFormFieldOutputModel,
  getFormInputModel,
  getFormOutputModel,
  getSubmissionInputModel,
  getSubmissionOutputModel,
  listFormFieldsInputModel,
  listFormFieldsOutputModel,
  listFormResponsesInputModel,
  listFormResponsesOutputModel,
  listMyFormsInputModel,
  listMyFormsOutputModel,
  listSubmissionsInputModel,
  listSubmissionsOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  updateFormFieldInputModel,
  updateFormFieldOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
} from "./model";
import { formFieldService, formService, formSubmissionService } from "../../services";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description, theme } = input;

      const { id } = await formService.createForm({
        title,
        description,
        theme,
        createdBy: ctx.user.id,
      });

      return { id };
    }),

  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ input }) => {
      return formService.updateForm(input);
    }),


  listForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listForms"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listMyFormsInputModel)
    .output(listMyFormsOutputModel)
    .query(async ({ input, ctx }) => {
      const forms = await formService.listFormsByUserId({
        userId: input?.userId ?? ctx.user.id,
      });

      return forms;
    }),

  getForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getForm"),
        tags: TAGS,
      },
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ input }) => {
      return formService.getFormById({ formId: input.formId });
    }),

  // Form Fields Procedures

  createFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.createFormField(input);
    }),

  bulkCreateFormFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/bulkCreateFormFields"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(bulkCreateFormFieldsInputModel)
    .output(bulkCreateFormFieldsOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.bulkCreateFormFields(input);
    }),

  listFormFields: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listFormFields"),
        tags: TAGS,
      },
    })
    .input(listFormFieldsInputModel)
    .output(listFormFieldsOutputModel)
    .query(async ({ input }) => {
      return formFieldService.listFormFieldsByFormId({ formId: input.formId });
    }),

  getFormField: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getFormField"),
        tags: TAGS,
      },
    })
    .input(getFormFieldInputModel)
    .output(getFormFieldOutputModel)
    .query(async ({ input }) => {
      return formFieldService.getFormFieldById({ id: input.id });
    }),

  updateFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/updateFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormFieldInputModel)
    .output(updateFormFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.updateFormField(input);
    }),

  deleteFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormFieldInputModel)
    .output(deleteFormFieldOutputModel)
    .mutation(async ({ input }) => {
      return formFieldService.deleteFormField({ id: input.id });
    }),

  // Form Submissions Procedures

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/submitForm"),
        tags: TAGS,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ input }) => {
      return formSubmissionService.submitForm(input);
    }),

  listSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listSubmissions"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listSubmissionsInputModel)
    .output(listSubmissionsOutputModel)
    .query(async ({ input }) => {
      return formSubmissionService.listSubmissionsByFormId({ formId: input.formId });
    }),

  listFormResponses: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/listFormResponses"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormResponsesInputModel)
    .output(listFormResponsesOutputModel)
    .query(async ({ input, ctx }) => {
      return formSubmissionService.listFormSubmissionsForCreator({
        formId: input.formId,
        userId: ctx.user.id,
      });
    }),

  getSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/getSubmission"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getSubmissionInputModel)
    .output(getSubmissionOutputModel)
    .query(async ({ input }) => {
      return formSubmissionService.getSubmissionById({ id: input.id });
    }),

  deleteSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/deleteSubmission"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteSubmissionInputModel)
    .output(deleteSubmissionOutputModel)
    .mutation(async ({ input }) => {
      return formSubmissionService.deleteSubmission({ id: input.id });
    }),
});