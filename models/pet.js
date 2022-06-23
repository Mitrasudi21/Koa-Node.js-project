/* eslint-disable linebreak-style */
module.exports = (ctx) => {
	return {
		create: async (input) => {
			try {
				if (!input._id) {
					input._id = new ctx.ObjectID();
				}
				await ctx.mongo.collection("pet").insertOne(input);
				return {status: true, msg: "Pet created", doc: input};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		update: async (id, values, projection) => {
			try {
				if (!projection) {
					projection={
						name: 1,
						petType: 1,
						isActive: 1,
					};
				}
				const updateObj = {$set: values};
				const result = await ctx.mongo.collection("pet").findOneAndUpdate({
					_id: ctx.ObjectID(id),
				}, updateObj, {
					returnDocument: "after", projection: projection,
				});
				return {status: true, msg: "pet updated", doc: result.value};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		delete: async (id) =>{
			try {
				await ctx.mongo.collection("pet").deleteOne({
					_id: ctx.ObjectID(id),
				});
				return {status: true, msg: "pet deleted"};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		list: async (query, projection) => {
			if (!projection) {
				projection = {
					name: 1,
					petType: 1,
					isActive: 1,
				};
			}
			if (query._id) {
				if (typeof query._id === "string" || query._id instanceof String) {
					query._id = ctx.ObjectID(query._id);
				}
			}
			try {
				const docs = await ctx.mongo.collection("pet").find(query, {projection: projection}).toArray();
				return {status: true, msg: "OK", docs: docs};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		details: async (query, projection) => {
			try {
				if (!projection) {
					projection={
						name: 1,
						petType: 1,
						isActive: 1,
					};
				}
				const doc = await ctx.mongo.collection("pet").findOne(query, {projection: projection});
				return {status: true, msg: "Ok", doc: doc};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
	};
};
