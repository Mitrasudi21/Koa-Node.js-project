/* eslint-disable linebreak-style */
function petValidator(input, validateExisting) {
	if (!validateExisting && (!(input.name && input.petType))) {
		return {status: false, msg: "Parameter(s) missing."};
	}
	if (input.name) {
		if ((input.name.length < 2) || (input.name.length > 80)) {
			return {status: false, msg: "Invalid value for 'Name'."};
		}
		input.name = input.name.toUpperCase();
	}
	const _ = require("lodash");
	input = _.omitBy(input, _.isNil);
	return {status: true, msg: "", data: input};
}

function studentValidator(input, validateExisting1) {
	if (!validateExisting1 && (!(input.name && input.gender))) {
		return {status: false, msg: "Parameter(s) missing."};
	}
	if (input.name) {
		if ((input.name.length < 2) || (input.name.length > 80)) {
			return {status: false, msg: "Invalid value for 'Name'."};
		}
		input.name = input.name.toUpperCase();
	}
	const _ = require("lodash");
	input = _.omitBy(input, _.isNil);
	return {status: true, msg: "", data: input};
}
module.exports = {

	createPet: async (ctx) => {
		const nameVal = ctx.request.fields.name;
		const petTypeVal = ctx.request.fields.petType;

		const now = new Date();
		const input = {
			name: nameVal,
			petType: petTypeVal,
		};
		input.isActive = true;
		input.createdAt = now;
		input.updatedAt = now;

		const validationResult = petValidator(input);
		if (!validationResult.status) {
			return ctx.ok(validationResult);
		}
		const model = require("../models/pet")(ctx);
		const result = await model.create(validationResult.data);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	updatePet: async (ctx) => {
		if (!(ctx.request.fields.find && ctx.request.fields.update)) {
			return ctx.ok({status: false, msg: "Parameter(s) missing."});
		}
		const petId = ctx.request.fields.find;
		const nameVal = ctx.request.fields.update.name;
		const petTypeVal = ctx.request.fields.update.petType;
		const isActiveVal = ctx.request.fields.update.isActive;

		const now = new Date();
		let input = {
			name: nameVal,
			petType: petTypeVal,
			isActive: isActiveVal,
		};

		const validationResult = petValidator(input, true);
		if (!validationResult.status) {
			return ctx.ok(validationResult);
		}
		input = validationResult.data;
		input.updatedAt = now;
		const model = require("../models/pet")(ctx);
		const result = await model.update(petId, input);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	deletePet: async (ctx) => {
		const petId = ctx.request.fields._id;
		const model = require("../models/pet")(ctx);
		const result = await model.delete(petId);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	createStudent: async (ctx) => {
		const nameVal = ctx.request.fields.name;
		const genderVal = ctx.request.fields.gender;
		const petVal = ctx.request.fields.pet;

		const now = new Date();
		const input = {
			name: nameVal,
			gender: genderVal,
			pet: petVal,
		};
		input.isActive = true;
		input.createdAt = now;
		input.updatedAt = now;

		const validationResult = studentValidator(input);
		if (!validationResult.status) {
			return ctx.ok(validationResult);
		}
		const model = require("../models/student")(ctx);
		const result = await model.create(validationResult.data);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	updateStudent: async (ctx) => {
		if (!(ctx.request.fields.find && ctx.request.fields.update)) {
			return ctx.ok({status: false, msg: "Parameter(s) missing."});
		}
		const studentId = ctx.request.fields.find;
		const nameVal = ctx.request.fields.update.name;
		const genderVal = ctx.request.fields.update.gender;
		const isActiveVal = ctx.request.fields.update.isActive;
		const petVal = ctx.request.fields.update.pet;

		const now = new Date();
		let input = {
			name: nameVal,
			gender: genderVal,
			isActive: isActiveVal,
			pet: petVal,
		};

		const validationResult = studentValidator(input, true);
		if (!validationResult.status) {
			return ctx.ok(validationResult);
		}
		input = validationResult.data;
		input.updatedAt = now;
		const model = require("../models/student")(ctx);
		const result = await model.update(studentId, input);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	deleteStudent: async (ctx) => {
		const studentId = ctx.request.fields._id;
		const model = require("../models/student")(ctx);
		const result = await model.delete(studentId);
		return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
	excelData: async (ctx) => {
		var excelData = ctx.request.fields.formData;
		console.log(excelData);
		// const nameVal = ctx.request.fields.ExcelData[0].student;
		// const genderVal = ctx.request.fields.ExcelData[0].Gender;
		// const petVal = ctx.request.fields.ExcelData[0].Pet;
		// const now = new Date();
		// const input = {
		// 	name: nameVal,
		// 	gender: genderVal,
		// 	pet: petVal,
		// };
		// input.isActive = true;
		// input.createdAt = now;
		// input.updatedAt = now;

		// const validationResult = studentValidator(input);
		// if (!validationResult.status) {
		// 	return ctx.ok(validationResult);
		// }
		// const model = require("../models/student")(ctx);
		// const result = await model.excelDataTransfer(validationResult.data);
		// return ctx.ok({status: true, msg: "OK", doc: result.doc});
	},
};
