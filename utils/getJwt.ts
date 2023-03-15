export const getJwt = async (signature: string) => await signature.slice(0, 54);
