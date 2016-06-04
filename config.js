module.exports = {
	db: process.env.DB || require("./keys.json");.db,
	key: process.env.KEY || require("./keys.json");.fatSecretKey
}