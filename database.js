const { Signer } = require("@aws-sdk/rds-signer"); // correct package
const { Pool } = require("pg");

let pool;
let tokenExpiry = 0;

async function connectToDatabase() {
  if (pool && Date.now() < tokenExpiry) return pool; // reuse if token still valid

  const signer = new Signer({
    region: process.env.AWS_REGION || "eu-west-2",
    hostname: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
  });

  const token = await signer.getAuthToken(); // actual token, not a string
  tokenExpiry = Date.now() + 14 * 60 * 1000; // refresh before 15 min expiry

  if (pool) await pool.end(); // cleanly close old pool before recreating

  pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: "database-1.cluster-c32samc0mnw9.eu-west-2.rds.amazonaws.com:5432/?Action=connect&DBUser=postgres&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA36QZH6M3URMZGL7A%2F20260529%2Feu-west-2%2Frds-db%2Faws4_request&X-Amz-Date=20260529T105157Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIAJuQ8H2fdYxwLOP%2FC0gxLjtFOawLsxQ6tMTeX4bVOUdAiEAuzCYCIhd9fxCF5BulfDhOzdFc%2FhS%2FcPkHpzWXvzEYasq5QIIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4MjE0NjU0NDUxNzUiDBLOklX6n%2FZCa0JKeCq5AoubtAhwfLkLSrsKRC0%2FkqOfEJThS2cNrTEMzxtI%2BelI08sDBQ4D%2BSZTMsJH49Z3rIoBaO5vdEsDw2EgjILDo6fjSQvK38p97lHKtbMYFcuXc4akjlZTNoTmbwwq8IhcyA0OiLC%2F%2BAxbW0%2BwqWruqrS90qIJUfq1t%2Fz%2B%2FL3tKG9JZjkIeFsWZj3H5B7VWJ2nWYP4SPrYKnNlgxE28qboyBgvHkUO1lWxVFeH43OA7R75Z7gNBXenAcmLWUsJynFg8TSjHlGXf93851HhhE6YV0XtwfScdTK8xrRDYkCyVnfGzV814h6lPHsDJKVp2N%2B7QGzUDukLE0a2%2BqYKzkB%2FIhfCFOR60ufrepf%2BYSVfeticADzgFwnkFYkGrt05I39Umrf7cJnyaJij%2F5luIGY5eZxei9fiSVLw0zkwlK%2Fl0AY6rQJNRJuaFrR0v6qzg0AZKB49J2NCGxWFOekfmlc%2FMhZRCg%2FKvqg%2FFX0WtMFmohYOJLk%2F1hqPN%2F17UnB4V0s8ugI%2BAsUtBY0ojkW51LugnYS60X8NSwF%2BeD%2BKvuo4wAFUjem7AKI0kAxoCzHvN9u5egvPjErhMkEopZE8KQHP3p1ytnqsbbAso%2F3txDYS2FC5ii8V6aFOHc5KXvOc9Hs7MTStDaoNwc0%2B15jiZa6PSiAe1zkSsA8PQCD6pDIEzKleZkZFJrL6gW9r8sA%2BE4ARz%2BCgBFn%2FvIoJMBEsy3ca%2B8qxoS4T66ZORCUadYllkWMcOGr2h72mDQefCGHceaocr2Ip97xTILu0bDmo%2FNkAASlMDRK8YGn5UNhhwFgYElX4GvWrbujt%2FRXOBLOPygB2&X-Amz-Signature=6356fe6b4f7332333a653881d7e12ad65e5b9516d64f246123c19d30ccf55399&X-Amz-SignedHeaders=host", // the generated token used as password
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  console.log("Aurora pool created with IAM token");
  return pool;
}

module.exports = { connectToDatabase };