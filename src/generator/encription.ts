import bcrypt from "bcrypt";
const encryptPassword = async (password: string | undefined) => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = await bcrypt.hashSync(
    password === undefined ? "101035" : password,
    salt
  );
  return passwordHash;
};

const isPasswordMatch = async (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};

export default {
  isPasswordMatch,
  encryptPassword,
};
