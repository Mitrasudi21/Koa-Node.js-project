/* eslint-disable linebreak-style */

const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectId;

/* const DEVELOPMENT_URL = "mongodb+srv://learning:Default4321@cluster0.q6rps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PRODUCTION_URL = "mongodb+srv://learning:Default4321@cluster0.q6rps.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"; */

module.exports = async function(app) {
	try {
		// const connectionString = isProductionMode?PRODUCTION_URL:DEVELOPMENT_URL;
		const client = new MongoClient("mongodb://localhost:27017", {minPoolSize: 5});
		await client.connect();
		const db = client.db("learning");
		app.context.mongo = db;
		app.context.ObjectID = ObjectID;
	} catch (err) {
		console.log(err);
		// throw new Error(500);
	}
};
