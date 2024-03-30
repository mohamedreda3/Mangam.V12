const mysql = require('./dbconfig')

async function executeQyery(query, depend = null) {
    return new Promise(async (resolve, reject) => {
        mysql.query(query, depend, (err, result) => {
            if (err) resolve(err);
            resolve(result);
        });
    })
}

module.exports = executeQyery