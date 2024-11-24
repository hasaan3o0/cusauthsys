import * as fs from "fs/promises";

interface User {
  id: string;
  email: string;
  password: string;
}

const DB_PATH = "./users.json";

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data).users;
  } catch (error) {
    await fs.writeFile(DB_PATH, JSON.stringify({ users: [] }));
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify({ users }, null, 2));
}

export async function createUser(
  email: string,
  password: string
): Promise<User> {
  const users = await readUsers();
  const user = {
    id: Math.random().toString(36).substring(7),
    email,
    password,
  };
  users.push(user);
  await writeUsers(users);
  
  return user;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const users = await readUsers();
  const user = users.find((user) => user.email === email);
 
  return user;
}

export async function validateCredentials(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readUsers();
  console.log("DB: Validating credentials for email:", email);
  const user = users.find((u) => u.email === email);
  const isValid = user && user.password === password;
  console.log("DB: Credentials valid:", isValid);
  if (isValid) {
    return user;
  }
  return null;
}

