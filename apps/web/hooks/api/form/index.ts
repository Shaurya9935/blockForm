import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createForm,
    createFormAsync,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    isPending,
    status,
  };
};

export const useGetForms = () => {
  const { data: forms, error, isFetched, isFetching, isLoading, isError, status } =
    trpc.form.listForms.useQuery();

  return {
    forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    isError,
    status,
  };
};

export const useGetForm = (formId: string) => {
  const { data: form, error, isFetched, isFetching, isLoading, status } =
    trpc.form.getForm.useQuery({ formId }, { enabled: !!formId });

  return {
    form,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};

// Form Fields React Query Hooks

export const useCreateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: createFormFieldAsync,
    mutate: createFormField,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createFormField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormField,
    createFormFieldAsync,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  };
};

export const useBulkCreateFormFields = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: bulkCreateFormFieldsAsync,
    mutate: bulkCreateFormFields,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  } = trpc.form.bulkCreateFormFields.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    bulkCreateFormFields,
    bulkCreateFormFieldsAsync,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  };
};

export const useUpdateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  } = trpc.form.updateFormField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    updateFormField,
    updateFormFieldAsync,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  };
};

export const useDeleteFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  } = trpc.form.deleteFormField.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    deleteFormField,
    deleteFormFieldAsync,
    error,
    isError,
    isPending,
    isSuccess,
    status,
  };
};

export const useGetFormFields = (formId: string) => {
  const { data: fields, error, isFetched, isFetching, isLoading, status } =
    trpc.form.listFormFields.useQuery({ formId }, { enabled: !!formId });

  return {
    fields,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};
