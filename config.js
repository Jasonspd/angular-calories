var keys = require("./keys.json");

module.exports = {
	db: process.env.DB || keys.db,
	key: process.env.KEY || keys.fatSecretKey
}