import { trpc } from "~/trpc/client";

export const useSignUp = () => {
    const utils = trpc.useUtils();

    const {
        mutateAsync:createUserWithEmailAndPasswordAsync,
        mutate:createUserWithEmailAndPassword,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    } = trpc.auth.createUserWithEmailAndPassword.useMutation()
    return {
        createUserWithEmailAndPassword,
        createUserWithEmailAndPasswordAsync,
        error,
        failureCount,
        isError,
        isIdle,
        isPending,
        isSuccess,
        status
    }
}