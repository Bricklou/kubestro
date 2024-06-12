export const serverCreateFormTransformer = async (
  request: Request,
): Promise<{ name: string; namespace: string }> => {
  const formData = await request.formData();
  return {
    name: formData.get("name") as string,
    namespace: formData.get("namespace") as string,
  };
};
