const passwordsMachine = require("machinepack-passwords");

const encryptPassword = (password, callback)=> {
	passwordsMachine.encryptPassword({
		password: password,
	}).exec({
		error: function(err) {
			return callback(null, null);
		},
		success: function(result) {
			return callback(null, result);
		},
	});
};

const comparePassword = (password, encrypted, callback) =>{
	passwordsMachine.checkPassword({
		passwordAttempt: password,
		encryptedPassword: encrypted,
	}).exec({
		error: function(err) {
			return callback(null, false);
		},
		incorrect: function() {
			return callback(null, false);
		},
		success: function() {
			return callback(null, true);
		},
	});
};

module.exports = {
	encryptPasswordAsync: (password) =>{
		return new Promise(function(resolve, reject) {
			encryptPassword(password, function(err, encrypted) {
				if (err) {
					reject(err);
				} else {
					resolve(encrypted);
				}
			});
		});
	},
	comparePasswordAsync: (password, encrypted) =>{
		return new Promise(function(resolve, reject) {
			comparePassword(password, encrypted, function(err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	},
	isValidDate: (date)=> {
		if (Object.prototype.toString.call(date) === "[object Date]") {
			if (isNaN(date.getTime())) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	},
	JSDateToExcelDate: (inDate) => {
		return 25569.0 + ((inDate.getTime() - (inDate.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24));
	},
};
