const _ = require("lodash");
//  const path = require("path");
const fs = require("fs");

const checkPrivilege = (session, privilegeName, requiredAccess) => {
	if (session && session.privileges) {
		const privilegeNames = Object.keys(session.privileges);
		let returnVal = false;
		for (let loop=0, length= privilegeNames.length; loop<length; loop++) {
			if (privilegeNames[loop]==privilegeName) {
				const access = session.privileges[privilegeName].access;
				const diff = _.difference(requiredAccess, access);
				if (diff.length != 0) {
					break;
				} else {
					returnVal = true;
				}
			} else if (session.privileges[privilegeNames[loop]].childNodes) {
				const innerPrivileges = session.privileges[privilegeNames[loop]].childNodes;
				if (innerPrivileges[privilegeName]) {
					const access = innerPrivileges[privilegeName].access;
					const diff = _.difference(requiredAccess, access);
					if (diff.length != 0) {
						break;
					} else {
						returnVal = true;
					}
				}
			}
		}
		return returnVal;
	} else {
		return false;
	}
};

const cp = checkPrivilege;

const restrictedPaths = {
	"/home.html": {required: ["userId"], redirect: "/login.html"},
	"/login.html": {
		required: (session) => {
			if (session && session.userId) {
				return false;
			}
			return true;
		},
		redirect: "/home.html",
	},
	"/user-management.html": {
		required: (session) => {
			return cp(session, "user_management", ["view"]);
		}, redirect: "/login.html",
	},
	"/company-management.html": {
		required: (session) => {
			return cp(session, "company_management", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/factory.html": {
		required: (session) => {
			return cp(session, "factory_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/doc-type.html": {
		required: (session) => {
			return cp(session, "doc_type_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/holiday.html": {
		required: (session) => {
			return cp(session, "holiday_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/employee-type.html": {
		required: (session) => {
			return cp(session, "employee_type_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/department.html": {
		required: (session) => {
			return cp(session, "department_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/process.html": {
		required: (session) => {
			return cp(session, "process_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/process-department.html": {
		required: (session) => {
			return cp(session, "process_dept_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/workforce.html": {
		required: (session) => {
			return cp(session, "workforce_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/costing-rate.html": {
		required: (session) => {
			return cp(session, "costing_rate_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/mark.html": {
		required: (session) => {
			return cp(session, "mark_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/season.html": {
		required: (session) => {
			return cp(session, "season_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/sale-type.html": {
		required: (session) => {
			return cp(session, "sale_type_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/sampling-rule.html": {
		required: (session) => {
			return cp(session, "sampling_rule_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/category.html": {
		required: (session) => {
			return cp(session, "category_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/packing.html": {
		required: (session) => {
			return cp(session, "packing_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/grade.html": {
		required: (session) => {
			return cp(session, "grade_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/energy-source.html": {
		required: (session) => {
			return cp(session, "energy_source_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/electricity-meter.html": {
		required: (session) => {
			return cp(session, "electricity_meter_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/genset.html": {
		required: (session) => {
			return cp(session, "genset_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/heater.html": {
		required: (session) => {
			return cp(session, "heater_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/process-machine.html": {
		required: (session) => {
			return cp(session, "process_machine_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/process-param-frequency.html": {
		required: (session) => {
			return cp(session, "process_param_freq_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/process-param.html": {
		required: (session) => {
			return cp(session, "process_param_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/periodic-maint-param.html": {
		required: (session) => {
			return cp(session, "periodic_maint_param_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/party.html": {
		required: (session) => {
			return cp(session, "party_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/vehicle.html": {
		required: (session) => {
			return cp(session, "vehicle_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/usual-transporter.html": {
		required: (session) => {
			return cp(session, "usual_transporter_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/leaf-type.html": {
		required: (session) => {
			return cp(session, "leaf_type_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/leaf-count.html": {
		required: (session) => {
			return cp(session, "leaf_count_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/gl-price.html": {
		required: (session) => {
			return cp(session, "gl_price_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/masters/production-type.html": {
		required: (session) => {
			return cp(session, "prod_type_master", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/gl-receipt.html": {
		required: (session) => {
			return cp(session, "gl_receipt", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/fine-lf-count-receipt.html": {
		required: (session) => {
			return cp(session, "fine_lf_cnt_receipt", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/factory-running.html": {
		required: (session) => {
			return cp(session, "fact_running", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/weather.html": {
		required: (session) => {
			return cp(session, "weather", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/machine-running.html": {
		required: (session) => {
			return cp(session, "mach_running", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/electricity-meter-reading.html": {
		required: (session) => {
			return cp(session, "elec_meter_reading", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/process-param-running.html": {
		required: (session) => {
			return cp(session, "process_param_running", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/periodic-maintenance-done.html": {
		required: (session) => {
			return cp(session, "periodic_maint_done", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/production.html": {
		required: (session) => {
			return cp(session, "production", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/packing-invoice.html": {
		required: (session) => {
			return cp(session, "packing_invoice", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/dps-invoice.html": {
		required: (session) => {
			return cp(session, "dps_invoice", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/tw-invoice.html": {
		required: (session) => {
			return cp(session, "tw_invoice", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/tasting.html": {
		required: (session) => {
			return cp(session, "tasting", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/despatch.html": {
		required: (session) => {
			return cp(session, "despatch", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/sampling.html": {
		required: (session) => {
			return cp(session, "sampling", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/split-invoice.html": {
		required: (session) => {
			return cp(session, "split_invoice", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/heater-running.html": {
		required: (session) => {
			return cp(session, "heater_running", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/genset-running.html": {
		required: (session) => {
			return cp(session, "genset_running", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/employees-worked.html": {
		required: (session) => {
			return cp(session, "employees_worked", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/warehouse-arrival.html": {
		required: (session) => {
			return cp(session, "warehouse_arrival", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/printing-position.html": {
		required: (session) => {
			return cp(session, "printing_position", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/sale-price.html": {
		required: (session) => {
			return cp(session, "sale_price", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/private-sale.html": {
		required: (session) => {
			return cp(session, "pvt_sale", ["view"]);
		}, redirect: "/login.html",
	},
	"/transaction/label-printing.html": {
		required: (session) => {
			return cp(session, "label_printing", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/weekly-leaf-purchased.html": {
		required: (session) => {
			return cp(session, "weekely_leaf_purchased", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/grade-percentage.html": {
		required: (session) => {
			return cp(session, "grade_percentage", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/factory-daily-report.html": {
		required: (session) => {
			return cp(session, "factory_daily_report", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/rg1-report.html": {
		required: (session) => {
			return cp(session, "rg1_report", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/grade-mean-price.html": {
		required: (session) => {
			return cp(session, "grade_mean_price", ["view"]);
		}, redirect: "/login.html",
	},
	"/reports/markwise-sale-price.html": {
		required: (session) => {
			return cp(session, "markwise_sale_price", ["view"]);
		}, redirect: "/login.html",
	},
};

const multipartPaths = {
	"/bulk-user-create.json": true,
	"/bulk-factory-create.json": true,
	"/bulk-docType-create.json": true,
	"/bulk-department-create.json": true,
	"/bulk-process-create.json": true,
	"/bulk-processDepartment-create.json": true,
	"/bulk-workforce-create.json": true,
	"/bulk-costingRate-create.json": true,
	"/bulk-mark-create.json": true,
	"/bulk-season-create.json": true,
	"/bulk-saleType-create.json": true,
	"/bulk-grade-create.json": true,
	"/bulk-energySource-create.json": true,
	"/bulk-electricityMeter-create.json": true,
	"/bulk-genset-create.json": true,
	"/bulk-processMachine-create.json": true,
	"/bulk-party-create.json": true,
	"/bulk-vehicle-create.json": true,
	"/bulk-usualTransporter-create.json": true,
	"/bulk-leafCount-create.json": true,
	"/update-company-logo.json": true,
};

module.exports = {
	policyHandler: async function(ctx, next) {
		if (ctx.session) {
			ctx.session.save();
		}
		var path = ctx.path;
		if (!multipartPaths[path]) {
			const contentType = ctx.request.headers["content-type"];
			if (contentType && contentType.indexOf("multipart") >= 0) {
				if (ctx.request.files) {
					for (let loop = 0; loop < ctx.request.files.length; loop++) {
						fs.unlinkSync(ctx.request.files[loop].path);
					}
				}
			}
		}
		if (restrictedPaths[path]) {
			try {
				const required = restrictedPaths[path].required;
				if (required instanceof Array) {
					for (let loop = 0; loop < required.length; loop++) {
						if (!ctx.session[required[loop]]) {
							throw {};
						}
					}
				} else if (required instanceof Function) {
					const result = required(ctx.session);
					if (!result) {
						throw {};
					}
				}
			} catch (err) {
				const redirect = restrictedPaths[path].redirect;
				if (redirect) {
					throw {status: 403, redirect: redirect};
				} else {
					throw {status: 403, contextStatus: 200};
				}
			}
		}
		await next();
	},
};
