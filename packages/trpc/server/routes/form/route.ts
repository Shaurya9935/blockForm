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
  getFormFieldInputModel,
  getFormFieldOutputModel,
  getFormInputModel,
  getFormOutputModel,
  listFormFieldsInputModel,
  listFormFieldsOutputModel,
  listMyFormsInputModel,
  listMyFormsOutputModel,
  updateFormFieldInputModel,
  updateFormFieldOutputModel,
} from "./model";
import { formFieldService, formService } from "../../services";

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
      const { title, description } = input;

      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return { id };
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
});