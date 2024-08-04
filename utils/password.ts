import bcrypt from 'bcryptjs';

export async function makePassword(plainPassword: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);
    return hash;
  } catch (err) {
    throw new Error('Error hashing password');
  }
}

export async function comparePassword({
  plainPassword,
  hashPassword
}: {
  plainPassword: string,
  hashPassword: string
}): Promise<boolean> {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (err) {
    console.log(err);
    throw new Error('Error comparing password');
  }
}
