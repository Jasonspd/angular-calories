module.exports = {
	db: process.env.DB 			|| require("./keys.json").db,
	key: process.env.KEY 		|| require("./keys.json").key,
	secret: process.env.SECRET 	|| require("./keys.json").secret
}