import bcrypt from "bcrypt";
export const comparePassword = async (password, hashedpassword) => {
  return await bcrypt.compare(password, hashedpassword);
};

export const hashPassword = async (password) => {
  const hashedpassword = await bcrypt.hash(password, 10);
  return hashedpassword;
};
