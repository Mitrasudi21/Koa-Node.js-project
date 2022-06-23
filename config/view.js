/* global koaApp:true*/

const Handlebars = require("handlebars");
const _ = require("lodash");

Handlebars.registerHelper("_initVariable", function(varName, data) {
	if (varName) {
		return "var " + varName + " = " + ((typeof data == "object") ? JSON.stringify(data) : ((typeof data == "string") ? ("'" + data + "'") : data)) + ";";
	}
});

Handlebars.registerHelper("_pageTitle", function(title) {
	return title ? title : koaApp.appDisplayName;
});

Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
	switch (operator) {
	case "==":
		return (v1 == v2) ? options.fn(this) : options.inverse(this);
	case "===":
		return (v1 === v2) ? options.fn(this) : options.inverse(this);
	case "!=":
		return (v1 != v2) ? options.fn(this) : options.inverse(this);
	case "!==":
		return (v1 !== v2) ? options.fn(this) : options.inverse(this);
	case "<":
		return (v1 < v2) ? options.fn(this) : options.inverse(this);
	case "<=":
		return (v1 <= v2) ? options.fn(this) : options.inverse(this);
	case ">":
		return (v1 > v2) ? options.fn(this) : options.inverse(this);
	case ">=":
		return (v1 >= v2) ? options.fn(this) : options.inverse(this);
	case "&&":
		return (v1 && v2) ? options.fn(this) : options.inverse(this);
	case "||":
		return (v1 || v2) ? options.fn(this) : options.inverse(this);
	default:
		return options.inverse(this);
	}
});

Handlebars.registerHelper("arrayContains", function(arrayObj, arg) {
	try {
		if (arrayObj.indexOf(arg) >= 0) {
			return true;
		}
	} catch (e) {
		//
	}

	return false;
});

Handlebars.registerHelper("arrayDoesNotContains", function(arrayObj, arg) {
	try {
		if (arrayObj.indexOf(arg) >= 0) {
			return false;
		}
	} catch (e) {
		//
	}

	return true;
});

Handlebars.registerHelper("conditionalPrint", function(v1, operator, v2, option) {
	switch (operator) {
	case "==":
		return (v1 == v2) ? option : "";
	case "===":
		return (v1 === v2) ? option : "";
	case "!=":
		return (v1 != v2) ? option : "";
	case "!==":
		return (v1 !== v2) ? option : "";
	case "<":
		return (v1 < v2) ? option : "";
	case "<=":
		return (v1 <= v2) ? option : "";
	case ">":
		return (v1 > v2) ? option : "";
	case ">=":
		return (v1 >= v2) ? option : "";
	case "&&":
		return (v1 && v2) ? option : "";
	case "||":
		return (v1 || v2) ? option : "";
	case "in":
		try {
			v2 = v2.split(",");
			if (v2.indexOf(v1) >= 0) {
				return option;
			} else {
				return "";
			}
		} catch (ex) {
			return "";
		}
	case "notin":
		try {
			if (v2.indexOf(v1) >= 0) {
				return "";
			} else {
				return option;
			}
		} catch (ex) {
			return option;
		}
	default:
		return "";
	}
});

Handlebars.registerHelper("ternaryPrint", function(v1, operator, v2, successoption, failureoption) {
	switch (operator) {
	case "==":
		return (v1 == v2) ? successoption : failureoption;
	case "===":
		return (v1 === v2) ? successoption : failureoption;
	case "!=":
		return (v1 != v2) ? successoption : failureoption;
	case "!==":
		return (v1 !== v2) ? successoption : failureoption;
	case "<":
		return (v1 < v2) ? successoption : failureoption;
	case "<=":
		return (v1 <= v2) ? successoption : failureoption;
	case ">":
		return (v1 > v2) ? successoption : failureoption;
	case ">=":
		return (v1 >= v2) ? successoption : failureoption;
	case "&&":
		return (v1 && v2) ? successoption : failureoption;
	case "||":
		return (v1 || v2) ? successoption : failureoption;
	case "in":
		try {
			v2 = v2.split(",");
			if (v2.indexOf(v1) >= 0) {
				return successoption;
			} else {
				return failureoption;
			}
		} catch (ex) {
			return failureoption;
		}
	default:
		return failureoption;
	}
});

Handlebars.registerHelper("hasPrivilege", function(privileges, requiredPrivilege, requiredAccess, allAccess, options) {
	var matchedAccess = null;
	try {
		var basePrivileges = Object.keys(privileges);
		for (var loop = 0; loop < basePrivileges.length; loop++) {
			if (basePrivileges[loop] === requiredPrivilege) {
				matchedAccess = privileges[basePrivileges[loop]].access;
				break;
			}
			if (privileges[basePrivileges[loop]].childNodes) {
				var innerPrivileges = Object.keys(privileges[basePrivileges[loop]].childNodes);
				for (var innerLoop = 0; innerLoop < innerPrivileges.length; innerLoop++) {
					if (innerPrivileges[innerLoop] === requiredPrivilege) {
						matchedAccess = privileges[basePrivileges[loop]].childNodes[innerPrivileges[innerLoop]].access;
						break;
					}
				}
				if (matchedAccess) {
					break;
				}
			}
		}
	} catch (e) {
		//
	}
	if (matchedAccess) {
		requiredAccess = requiredAccess.split(",");
		var intersection = _.intersection(requiredAccess, matchedAccess);
		if (intersection.length === 0) {
			return options.inverse(this);
		} else {
			if (allAccess && requiredAccess.length === intersection.length) {
				return options.fn(this);
			} else if (!allAccess) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		}
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("copyrightYear", function(field) {
	var dt = new Date();
	return "© " + dt.getFullYear();
});

Handlebars.registerHelper("_fieldWidth", function(pos, dataArr) {
	if (dataArr[pos].topLevel) {
		if (dataArr[pos].width) {
			return "width:" + dataArr[pos].width + "%";
		}
		return "display:none";
	} else {
		let availableWidth = 100;
		for (var field in dataArr) {
			if (dataArr[field].topLevel) {
				availableWidth -= dataArr[field].width;
			}
		}
		availableWidth += 3;
		if (!dataArr[pos].width) {
			return "display:none";
		}
		return "width:" + ((dataArr[pos].width / availableWidth) * 100) + "%";
	}
});

Handlebars.registerHelper("_pendingFieldWidth", function(dataArr) {
	let availableWidth = 100;
	for (var field in dataArr) {
		if (dataArr[field].topLevel) {
			availableWidth -= dataArr[field].width;
		}
	}
	availableWidth -= 1;
	return "width:" + availableWidth + "%";
});

Handlebars.registerHelper("_fieldWidthPrev", function(pos, dataArr) {
	let availableWidth = 100;
	let prev = 0;
	for (var field in dataArr) {
		if (dataArr[field].topLevel) {
			availableWidth -= dataArr[field].width;
		} else {
			if (field <= pos) {
				prev += dataArr[field].width;
			}
		}
	}
	availableWidth += 3;
	return "width:" + ((prev / availableWidth) * 100) + "%";
});

const path = require("path");
const fs = require("fs");

const partials = {};
const partialsDir = path.join(__dirname, "../views", "partials");
const partialFileNames = fs.readdirSync(partialsDir);

partialFileNames.forEach(function(fileName) {
	try {
		if (fs.lstatSync(path.join(partialsDir, fileName)).isDirectory()) {
			const innerPartialFileNames = fs.readdirSync(path.join(partialsDir, fileName));
			innerPartialFileNames.forEach(function(innerFileName) {
				var matches = /^([^.]+).hbs$/.exec(innerFileName);
				if (!matches) {
					return;
				}
				var partialName = matches[1];
				partials[fileName + "/" + partialName] = "partials" + path.sep + fileName + path.sep + partialName;
			});
		} else {
			var matches = /^([^.]+).hbs$/.exec(fileName);
			if (!matches) {
				return;
			}
			var partialName = matches[1];
			partials[partialName] = "partials" + path.sep + partialName;
		}
	} catch (err) {
		//
	}
});
module.exports = {
	partials: partials,
	helpers: Handlebars.helpers,
};
