module.exports = {
	listUsers: async (ctx) => {
		const type = ctx.request.fields.userType;
		const model = require("../models/user")(ctx);
		const result = await model.list(type?{userType: type}:{companyId: "5eb2d65f5bbfeb46054a93b0"});
		return ctx.ok(result);
	},
};
