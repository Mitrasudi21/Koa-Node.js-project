/* eslint-disable no-extend-native */
/* eslint no-global-assign:0 */

// eslint-disable-next-line no-undef
jQuery.fn.scrollTo = function(elem) {
	$(this).scrollTop($(this).scrollTop() - $(this).offset().top + $(elem).offset().top - 45);
	return this;
};
$(function() {
	// $(".ui.sidebar").sidebar("attach events", ".toc.item");
	$(".ui.pointing.dropdown.link.item").dropdown();
});

// eslint-disable-next-line no-unused-vars
var PHONE_VALIDATOR = /^[6-9]\d{9}$/;

document.addEventListener("visibilitychange", function() {

});

// eslint-disable-next-line no-unused-vars
function toggleFilterView() {
	$("#invoiceFilters").transition({animation: "slide down"});
}
function initLogout() {
	$(".logout-modal").modal("show");
}

// eslint-disable-next-line no-unused-vars
function initLogoutResponsive() {
	$(".dimmed").click();
	setTimeout(initLogout, 500);
}

var BASE_URL = window.location.origin+"/";

// eslint-disable-next-line no-undef
// var app = angular.module("app", ["ui.router", "ngAnimate", "toastr", "selectize"]);
var app = angular.module("app", ["ui.router", "ngAnimate", "toastr", "angularUtils.directives.dirPagination", "selectize"]);
app.factory("dataFactory", ["$http", "toastr", function($http, toastr) {
	var obj = {};
	obj.toastSuccess = function(data) {
		toastr.success(data, "");
	};
	obj.toastError = function(data) {
		toastr.error(data, "");
	};
	obj.toastInfo = function(data) {
		toastr.info(data, "");
	};
	obj.get = function(q) {
		return $http.get(BASE_URL + q).then(function(results) {
			return results.data;
		});
	};
	obj.post = function(q, object) {
		return $http.post(BASE_URL + q, object).then(function(results) {
			return results.data;
		});
	};
	obj.put = function(q, object) {
		return $http.put(BASE_URL + q, object).then(function(results) {
			return results.data;
		});
	};
	obj.delete = function(q) {
		return $http.delete(BASE_URL + q).then(function(results) {
			return results.data;
		});
	};
	return obj;
}]);
// run.$inject = ['$rootScope', '$state', '$location', '$window'];
app.run(["$rootScope", function($rootScope) {
	$rootScope.BASE_URL = BASE_URL;
}]);
app.config(["toastrConfig", function(toastrConfig) {
	// eslint-disable-next-line no-undef
	angular.extend(toastrConfig, {
		autoDismiss: false,
		closeButton: true,
		containerId: "toast-container",
		maxOpened: 0,
		newestOnTop: true,
		positionClass: "toast-bottom-right",
		preventDuplicates: false,
		preventOpenDuplicates: false,
		target: "body",
	});
}]);

app.config(["$locationProvider", function($locationProvider) {
	$locationProvider.hashPrefix(""); // by default '!'
	// $locationProvider.html5Mode(true);
}]);

app.config(["paginationTemplateProvider", function(paginationTemplateProvider) {
	paginationTemplateProvider.setPath("/templates/dirPagination.tpl.html");
}]);

app.filter("isoDateFormat", function() {
	return function(isoDateString, format) {
		try {
			if (!format) {
				format = "DD-MM-YYYY HH:mm";
			}
			return moment(isoDateString).format(format);
		} catch (ex) {
			return "";
		}
	};
});


var timeInMillsDate = new Date();
app.filter("timeInMills", function() {
	return function(mills) {
		if (!mills) {
			return "n/a";
		}
		timeInMillsDate.setTime(1488047400000 + mills);
		return moment(timeInMillsDate).format("hh:mm a");
	};
});

app.config(["$provide", function($provide) {
	$provide.decorator("$state", ["$delegate", "$rootScope", function($delegate, $rootScope) {
		$rootScope.$on("$stateChangeStart", function(event, state, params) {
			$delegate.next = state;
			$delegate.toParams = params;
		});
		return $delegate;
	}]);
}]);

var currImageId = "";
// eslint-disable-next-line no-unused-vars
var currUploadedFile = null;

// eslint-disable-next-line no-unused-vars
function processFileForUpload(e) {
	try {
		var files = e.target.files || e.dataTransfer.files || e.originalEvent.dataTransfer.files;
		var file = files[0];
		if (file) {
			var extention = file.name.toUpperCase().split(".");
			extention = extention[extention.length - 1];
			if (file.size > (512 * 1024)) {
				if (["JPG", "JPEG"].indexOf(extention)>=0) {
					new Compressor(file, {
						quality: 0.7,
						maxWidth: 1920,
						maxHeight: 1080,
						success: function(cResult) {
							var cfile = new File([cResult], file.name);
							$("#img-"+currImageId).attr("src", URL.createObjectURL(cResult));
							currUploadedFile = cfile;
						},
						error: function(err) {
							$("#proxy-err-msg").attr("data-msg", "Failed to process this file");
							$("#proxy-err-msg").click();
							return;
						},
					});
				} else {
					$("#proxy-err-msg").attr("data-msg", "Please use a file smaller than 512kb");
					$("#proxy-err-msg").click();
					return;
				}
			}
			var reader = new FileReader();
			reader.onload = function(e) {
				$("#img-"+currImageId).attr("src", e.target.result);
				currUploadedFile = file;
			};

			reader.readAsDataURL(file);
			document.getElementById("invoice-thumbnail-upload").value = "";
		}
		return;
	} catch (err) {
		//
	}
}

// eslint-disable-next-line no-unused-vars
function ExcelDateToJSDate(serial) {
	var utc_days = Math.floor(serial - 25569);
	var utc_value = utc_days * 86400;
	var date_info = new Date(utc_value * 1000);
	var fractional_day = serial - Math.floor(serial) + 0.0000001;
	var total_seconds = Math.floor(86400 * fractional_day);
	var seconds = total_seconds % 60;
	total_seconds -= seconds;
	var hours = Math.floor(total_seconds / (60 * 60));
	var minutes = Math.floor(total_seconds / 60) % 60;
	return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

Date.prototype.getTimezoneOffsetMills = function() {
	return this.getTimezoneOffset() * 60 * 1000;
};

Date.prototype.getUTCTime = function() {
	return this.getTime() + (this.getTimezoneOffsetMills());
};

Date.prototype.setUTCTime = function(timeInMills) {
	timeInMills = timeInMills - this.getTimezoneOffsetMills();
	this.setTime(timeInMills);
};

Date.prototype.daysInMonth = function() {
	var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
	return d.getDate();
};

Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + days);
};

Date.prototype.print = function() {
	var dd = this.getDate();
	var mm = this.getMonth() + 1;

	var yyyy = this.getFullYear();
	if (dd < 10) {
		dd = "0" + dd;
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	return dd + "/" + mm + "/" + yyyy;
};

Date.prototype.parse = function(dateStr) {
	this.setDate(1);
	try {
		dateStr = dateStr.trim();
		var arr = dateStr.split("/");
		if (arr[2].length!=4) {
			throw {};
		}
		if (isNaN(this.setFullYear(Number(arr[2])))) {
			throw {};
		}
		if (isNaN(this.setMonth(Number(arr[1]) - 1))) {
			throw {};
		}
		if (isNaN(this.setDate(Number(arr[0])))) {
			throw {};
		}
		this.setHours(0);
		this.setMinutes(0);
		this.setSeconds(0);
		this.setMilliseconds(0);
		return true;
	} catch (e) {
		return false;
	}
};

Date.prototype.parseDayEnd = function(dateStr) {
	this.setDate(1);
	try {
		dateStr = dateStr.trim();
		var arr = dateStr.split("/");
		if (arr[2].length!=4) {
			throw {};
		}
		if (isNaN(this.setFullYear(Number(arr[2])))) {
			throw {};
		}
		if (isNaN(this.setMonth(Number(arr[1]) - 1))) {
			throw {};
		}
		if (isNaN(this.setDate(Number(arr[0])))) {
			throw {};
		}
		this.setHours(23);
		this.setMinutes(59);
		this.setSeconds(59);
		this.setMilliseconds(999);
		return true;
	} catch (e) {
		return false;
	}
};

Date.prototype.getWeek = function() {
	var dt = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
};

// eslint-disable-next-line no-unused-vars
function getUrlVars() {
	var vars = []; var hash;
	var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split("=");
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

// eslint-disable-next-line no-unused-vars
function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
}

// eslint-disable-next-line no-unused-vars
function isValidDate(d) {
	return d instanceof Date && !isNaN(d);
}

// eslint-disable-next-line no-unused-vars
var getFlattenedArray = function(docs, keepUnique) {
	var _iterate = function(obj, pre, keys) {
		if (!keys) {
			keys = [];
		}
		try {
			Object.keys(obj).forEach(function(key) {
				var _key = key;
				if (pre) {
					_key = pre + "_" + key;
				}
				if (!obj[key]) {
					keys.push(_key);
					values[valuePos][_key] = "";
				} else if (Array.isArray(obj[key])) {
					for (var loop = 0, length = obj[key].length; loop < length; loop++) {
						if (loop>0) {
							values.push({});
							valuePos++;
						}
						if (typeof obj[key][loop] != "object") {
							keys.push(_key);
							values[valuePos][_key] = obj[key];
						} else {
							_iterate(obj[key][loop], _key, keys);
						}
					}
				} else if (typeof obj[key] === "object") {
					_iterate(obj[key], _key, keys);
				} else {
					keys.push(_key);
					values[valuePos][_key] = obj[key];
				}
			});
		} catch (err) {
			//
		}
	};
	var updateValues = function(values) {
		var prevValues = {};
		var loop=0;
		var length = 0;
		var innerLoop = 0;
		var innerlength = 0;
		var value = null;
		var key = null;
		var v = null;
		for (loop=0, length = values.length; loop<length; loop++) {
			value = values[loop];
			for (innerLoop=0, innerlength = keys.length; innerLoop<innerlength; innerLoop++) {
				key = keys[innerLoop];
				v = value[key];
				if (v != null) {
					prevValues[key] = v;
				} else if (prevValues[key]) {
					value[key] = prevValues[key];
				}
			}
		}
		prevValues = {};
		for (loop=values.length-1; loop>=0; loop--) {
			value = values[loop];
			for (innerLoop=0, innerlength = keys.length; innerLoop<innerlength; innerLoop++) {
				key = keys[innerLoop];
				v = value[key];
				if (v != null) {
					prevValues[key] = v;
				} else if (prevValues[key]) {
					value[key] = prevValues[key];
				}
			}
		}
	};
	var keys = [];
	var values = [];
	var valuePos = 0;
	var finalValues = [];
	for (var loop = 0, length = docs.length; loop < length; loop++) {
		var obj = docs[loop];
		values.push({});
		_iterate(obj, "", keys);
		keys = _.uniq(keys);
		if (values.length>1) {
			updateValues(values);
		}
		finalValues = finalValues.concat(values);
		valuePos = 0;
		values = [];
	}
	keys.sort();
	if (!keepUnique) {
		finalValues = _.uniqWith(finalValues, _.isEqual);
	}
	return {keys: keys, values: finalValues};
};

// eslint-disable-next-line no-unused-vars
var __round = function(input) {
	if (!input) {
		return 0;
	}
	return _.round(input, 3);
};

function datenum(v, date1904) {
	if (date1904) {
		v += 1462;
	}
	var offset = v.getTimezoneOffsetMills() * -1;
	var epoch = Date.parse(v);
	epoch += offset;
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

// eslint-disable-next-line no-unused-vars
function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {
		s: {
			c: 10000000,
			r: 10000000,
		},
		e: {
			c: 0,
			r: 0,
		},
	};
	for (var R = 0; R != data.length; ++R) {
		for (var C = 0; C != data[R].length; ++C) {
			if (range.s.r > R) {
				range.s.r = R;
			}
			if (range.s.c > C) {
				range.s.c = C;
			}
			if (range.e.r < R) {
				range.e.r = R;
			}
			if (range.e.c < C) {
				range.e.c = C;
			}
			var cell = {
				v: data[R][C],
			};
			if (cell.v == null) {
				continue;
			}
			var cell_ref = XLSX.utils.encode_cell({
				c: C,
				r: R,
			});

			if (typeof cell.v === "number") {
				cell.t = "n";
			} else if (typeof cell.v === "boolean") {
				cell.t = "b";
			} else if (cell.v instanceof Date) {
				cell.t = "n";
				cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			} else {
				cell.t = "s";
			}

			ws[cell_ref] = cell;
		}
	}
	if (range.s.c < 10000000) {
		ws["!ref"] = XLSX.utils.encode_range(range);
	}
	return ws;
}

// eslint-disable-next-line no-unused-vars
function Workbook() {
	if (!(this instanceof Workbook)) {
		return new Workbook();
	}
	this.SheetNames = [];
	this.Sheets = {};
}

// eslint-disable-next-line no-unused-vars
function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i = 0; i != s.length; ++i) {
		view[i] = s.charCodeAt(i) & 0xFF;
	}
	return buf;
}

// eslint-disable-next-line no-unused-vars
function date2String(d) {
	var date = d.getDate();
	if (date<10) {
		date= "0"+date;
	}
	var month = d.getMonth() +1;
	if (month<10) {
		month= "0"+month;
	}
	return date+"/"+month+"/"+d.getFullYear();
}
var offset = new Date().getTimezoneOffsetMills();
// eslint-disable-next-line no-unused-vars
function excelDateToJSDate(date) {
	return new Date(Math.round(((date - 25569)*86400*1000)+offset));
}

