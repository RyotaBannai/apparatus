interface argsType {
  args: Record<string, any> | null;
}

export const policy = {
  typePolicies: {
    Query: {
      fields: {},
    },
  },
};
