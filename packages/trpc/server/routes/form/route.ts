import { authenticatedProcedure, publicProcedure, router } from "../../trpc"
import { generatePath } from "../../utils/path-generator"
import { createFormInputModel, createFormOutputModel, listMyFormsInputModel, listMyFormsOutputModel } from "./model"
import { formService } from '../../services'


const TAGS = ["Form"]
const getPath = generatePath('/form')

export const formRouter = router({
    createForm: authenticatedProcedure.meta({
        openapi: {
            method: 'POST',
            path: getPath('/createForm'),
            tags: TAGS,
            protect: true
        }
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async({ input, ctx}) => {
        const {title, description} = input;

        const { id } = await formService.createForm({
            title,
            description,
            createdBy: ctx.user.id
        })

        return { id }
    }),

    listForms: authenticatedProcedure
    .meta({
        openapi: {
            method: 'POST',
            path: getPath('/listForms'),
            tags: TAGS,
            protect:true
        }
    })
    .input(listMyFormsInputModel)
    .output(listMyFormsOutputModel)
    .query(async({ input, ctx }) => {
        const forms = await formService.listFormsByUserId({
            userId: input?.userId ?? ctx.user.id
        })

        return forms;
    })
})