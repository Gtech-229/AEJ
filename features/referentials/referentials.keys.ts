/** Query-key factory for the AEJ referentials. */
export const referentialsKeys = {
  all: ['referentials'] as const,
  list: (name: string) => [...referentialsKeys.all, name] as const,
};
