/* eslint no-extend-native:0 */

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

Date.prototype.addDays = function(days) {
	this.setDate(this.getDate() + days);
};

Date.prototype.daysInMonth = function() {
	var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
	return d.getDate();
};

Date.prototype.getWeek = function() {
	var dt = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((((this - dt) / 86400000) + dt.getDay()+1)/7);
};

global.getDateOfISOWeek = function(w, y) {
	var simple = new Date(y, 0, 1 + (w - 1) * 7);
	var dow = simple.getDay();
	var ISOweekStart = simple;
	if (dow <= 4) {
		ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
	} else {
		ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
	}
	return ISOweekStart;
};
