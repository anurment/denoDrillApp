import { sql } from "../database/database.js";

const findUserIdByEmail = async (email) => {
    const rows = await sql`SELECT id From users WHERE email=${email}`;
    return rows;

};

const findUserByEmail = async (email) => {
    const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows;
  };

const addUser = async (email, hash) => {
    await sql`INSERT INTO users (email, password) VALUES (${email}, ${hash})`;
};

export {findUserIdByEmail, findUserByEmail, addUser};
