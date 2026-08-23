import { trpc } from "~/trpc/client";

export const useSignUp = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation();
  return {
    createUserWithEmailAndPassword,
    createUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useSignIn = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: signInUserWithEmailAndPasswordAsync,
    mutate: signInUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.auth.signInUserWithEmailAndPassword.useMutation();

  return {
    signInUserWithEmailAndPassword,
    signInUserWithEmailAndPasswordAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useGetLoggedInUserInfo = () => {
  const { data, isLoading, isError, error, refetch } = trpc.auth.getLoggedInUserInfo.useQuery(
    undefined,
    {
      retry: false,
    }
  );

  return {
    user: data,
    isLoading,
    isError,
    error,
    refetch,
  };
};

export const useSignOut = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: signOutAsync,
    mutate: signOut,
    isPending,
    isError,
    error,
  } = trpc.auth.signOut.useMutation({
    onSuccess: () => {
      // Wipe cached user data immediately
      utils.auth.getLoggedInUserInfo.reset();
    },
  });

  return {
    signOut,
    signOutAsync,
    isPending,
    isError,
    error,
  };
};
