const mysql = require("mysql2");

const pool = mysql.createPool({
  host:"manjjami3489fh92.cnqbvw2omnq2.me-south-1.rds.amazonaws.com",
  user: "ManJAM2390e",
  password: "GycbT5hKaVM525Ah0v1x",
  database: "Manjam_v2",
  waitForConnections: true, // This option waits for a free connection if the maximum connection limit is reached.
  // connectionLimit: 10, // Adjust this value based on your server's capabilities and requirements.
  queueLimit: 0, // No limit on the connection queue.
});
// host:"manjjami3489fh92.cnqbvw2omnq2.me-south-1.rds.amazonaws.com",
//   user: "ManJAM2390e",
//   password: "GycbT5hKaVM525Ah0v1x",
//   database: "Manjam_v2",
pool.getConnection(function (err, connection) {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database!");
    // Perform database operations here using the 'connection' object.
  }
});

module.exports = pool;
