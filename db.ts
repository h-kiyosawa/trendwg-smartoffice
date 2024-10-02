import { Client } from "pg";

const client = new Client({
    user: "postgres",
    database: "postgres",
    hostname: "localhost",
    password: "officepass",
    port: 5432,
});

await client.connect();

export default client;
