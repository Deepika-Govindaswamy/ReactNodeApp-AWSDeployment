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
    password: "database-1.cluster-c32samc0mnw9.eu-west-2.rds.amazonaws.com:5432/?Action=connect&DBUser=postgres&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA36QZH6M3VEWK5TUF%2F20260529%2Feu-west-2%2Frds-db%2Faws4_request&X-Amz-Date=20260529T111757Z&X-Amz-Expires=900&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPz%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMiJHMEUCIQC3ToOMQU7Iap8HBI%2F0vAoSlrhlG1%2Bpq8DfEV%2FWr7RM8AIgUg42lk4z4yK7JPYu1vTO4GJGNFWZVjfEt0JUWAfFjzIq5QIIxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw4MjE0NjU0NDUxNzUiDE%2F7G4jw7UWnFQkKaiq5AtLabLlCIvOd49n6gjxY5QGkIZj%2Bm9K%2FsRsg7UmJXizIhfKz%2F%2FHa6x5K0YBECQaMmA9E3QoXg0nVWywdcuiDsN5m1%2FAgCRLE9olHsgouXk9fZt9FrrIOJSP7xSsUoRmJFrrClk57L%2FyJ0Tbm7oyMwaaCm4jDcQpR1vvYtqICA7Pyv2gOFX4lzbe3j%2FqVK%2BhWgSIuJyFtlqA9lebyWQVi7UAMJclwbm5BqANxiGdRTnCPurRDAjETynbtHY0vcy%2BGF4HWDeOQc8Brl5G0HEpm56dwKlBi45Ac30OC04EaVTECkJRj%2FK1seQQfdC2pPjTPHrIClSA%2FAGMDy71AaR3gn4kuCTxXXQ1vTadZuDURPtHtVVhAgwpvTDsigZ34i6FWnoT2lRLPIQr5oz3cGvskvDh%2BmH6GvTD6zKUwlK%2Fl0AY6rQJFfngNhseli2THDllG15ogzbpva9jx8SJzniOxWvta4y3%2BKRmoS7dA%2FRT80AhC%2Fjfvwjmtt54ipzDwuKx%2BefUDLe5gL%2FyNCDI9fJ0mDAlAifLcGEA6hqIYqcdebAc57dIqWqw5HFzQuGpMx1%2FKSmF0Z53B0YiLBirZ8ExSxiJVgMED%2FnBuMeTvqTwsoQ1UEOqFsbLeSaCAnAWTbZdUxUhIWnlbkfEyMB%2FEaW6jzDL54NfEnw4qocI1Uo5nqORv973Taj9FBKBiuu2fUl4zOWETgbiL9GrwRbWwNEFhfaaLfEENz2Ftjgd7NqsIUZbTqRSX2%2FQLd13c0Zs%2B%2Fcv9pJv%2FAJ3SNb3M%2BbcqDAUMZDh4Pq%2Fb7WMBuuGeZLB0vK65R44%2BKV4YqfZcaswIv16Z&X-Amz-Signature=f526f054e014f4f93fa4b89459a20bdee695228b2ca39e7ba23471a6a6c07404&X-Amz-SignedHeaders=host", // the generated token used as password
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  console.log("Aurora pool created with IAM token");
  return pool;
}

module.exports = { connectToDatabase };