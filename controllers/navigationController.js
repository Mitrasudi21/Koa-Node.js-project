/* eslint-disable linebreak-style */
module.exports = {
	landingPage: (ctx) => {
		ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");
		return ctx.renderView("landingPage", {
			title: koaApp.appDisplayName + "",
			scriptPath: "/prod/js/views/landing.js?ver=1",
		});
	},
	petManagement: async (ctx) => {
		ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");

		const model = require("../models/pet")(ctx);
		const result = await model.list({});
		if (!result.status) {
			throw {};
		}
		return ctx.renderView("petManagement", {
			title: koaApp.appDisplayName + " | Pet Management",
			// scriptPath: "/prod/js/views/petManagement.js?ver=1",
			scriptPath: "/js/views/petManagement.js?ver=1",
			pets: result.docs,
		});
	},
	studentManagement: async (ctx) => {
		ctx.set("Cache-Control", "no-cache, no-store, must-revalidate");

		const model = require("../models/student")(ctx);
		const result = await model.list({});
		if (!result.status) {
			throw {};
		}
		const petModel = require("../models/pet")(ctx);
		const petResult = await petModel.list({});
		if (!petResult.status) {
			throw {};
		}
		return ctx.renderView("studentManagement", {
			title: koaApp.appDisplayName + " | Student Management",
			// scriptPath: "/prod/js/views/studentManagement.js?ver=1",
			scriptPath: "/js/views/studentManagement.js?ver=1",
			students: result.docs,
			pets: petResult.docs,
		});
	},
};

