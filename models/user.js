module.exports = (ctx) => {
	return {
		list: async (query, projection) => {
			if (!projection) {
				projection = {
					userName: 1,
					userEmail: 1,
					isActive: 1,
					contactNumber: 1,
					userType: 1,
					loginId: 1,
					code: 1,
				};
			}
			if (query._id) {
				if (typeof query._id === "string" || query._id instanceof String) {
					query._id = ctx.ObjectID(query._id);
				}
			}
			if (query.companyId) {
				if (typeof query.companyId === "string" || query.companyId instanceof String) {
					query.companyId = ctx.ObjectID(query.companyId);
				}
			}
			try {
				const docs = await ctx.mongo.collection("user").find(query, {projection: projection}).toArray();
				return {status: true, msg: "OK", docs: docs};
			} catch (err) {
				return {status: false, msg: "encountered an unexpected error."};
			}
		},
	};
};
