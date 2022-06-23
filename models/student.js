/* eslint-disable linebreak-style */
module.exports = (ctx) => {
	return {
		create: async (input) => {
			try {
				if (!input._id) {
					input._id = new ctx.ObjectID();
				}
				if (input.pet) {
					input.pet = ctx.ObjectID(input.pet);
				}
				await ctx.mongo.collection("student").insertOne(input);
				return {status: true, msg: "Student created", doc: input};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		update: async (id, values, projection) => {
			try {
				if (!projection) {
					projection={
						name: 1,
						gender: 1,
						isActive: 1,
						pet: 1,
					};
				}
				if (values.pet) {
					values.pet = ctx.ObjectID(values.pet);
				}
				const updateObj = {$set: values};
				const result = await ctx.mongo.collection("student").findOneAndUpdate({
					_id: ctx.ObjectID(id),
				}, updateObj, {
					returnDocument: "after", projection: projection,
				});
				return {status: true, msg: "student updated", doc: result.value};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		delete: async (id) => {
			try {
				await ctx.mongo.collection("student").deleteOne({
					_id: ctx.ObjectID(id),
				});
				return {status: true, msg: "Student deleted"};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		list: async (query) => {
			/* if (!projection) {
				projection = {
					name: 1,
					gender: 1,
					isActive: 1,
					pet: 1,
					petName: 1,
					pettype: 1,
				};
			} */
			if (query._id) {
				if (typeof query._id === "string" || query._id instanceof String) {
					query._id = ctx.ObjectID(query._id);
				}
			}
			try {
				const docs = await ctx.mongo.collection("student").aggregate([
					{$match: query},
					{
						$lookup: {
							from: "pet",
							localField: "pet",
							foreignField: "_id",
							as: "pet",
						},
					},
					{
						$unwind: "$pet",
					},
					{
						$project: {
							"_id": "$_id",
							"name": "$name",
							"gender": "$gender",
							"isActive": "$isActive",
							"pet": "$pet._id",
							"petName": "$pet.name",
							"pettype": "$pet.petType",
						},
					},
				]).toArray();
				return {status: true, msg: "OK", docs: docs};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		details: async (query) => {
			try {
				// if (!projection) {
				// 	projection={
				// 		name: 1,
				// 		gender: 1,
				// 		isActive: 1,
				// 		pet: 1,
				// 		petName: 1,
				// 		pettype: 1,
				// 	};
				const doc = await ctx.mongo.collection("student").aggregate([
					{$match: query},
					{
						$lookup: {
							from: "pet",
							localField: "pet",
							foreignField: "_id",
							as: "pet",
						},
					},
					{
						$unwind: "$pet",
					},
					{
						$project: {
							"_id": "$_id",
							"name": "$name",
							"gender": "$gender",
							"isActive": "$isActive",
							"pet": "$pet._id",
							"petName": "$pet.name",
							"pettype": "$pet.petType",
						},
					},
				]);
				return {status: true, msg: "Ok", doc: doc};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
		// excelDataTransfer: async (input) => {
		// 	try {
		// 		if (!input._id) {
		// 			input._id = new ctx.ObjectID();
		// 		}
		// 		await ctx.mongo.collection("student").insertMany(input);
		// 		return {status: true, msg: "Student created", doc: input};
		// 	} catch (err) {
		// 		return {status: false, msg: "encountered an unexpected error."};
		// 	}
		// },
	};
};
