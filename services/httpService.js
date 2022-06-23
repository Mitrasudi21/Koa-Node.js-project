const rp = require("request-promise-native");

module.exports = {
	getRequest: async (url, query, headers, isJson) => {
		const request ={uri: url};
		if (query) {
			request.qs = query;
		}
		if (headers) {
			request.headers = headers;
		}
		if (isJson == null || isJson == undefined) {
			isJson = true;
		}
		request.json = isJson;
		try {
			return await rp(request);
		} catch (err) {
			// console.log(err);
			return null;
		}
	},
	postRequest: async (url, body, headers, isJson, timeout) =>{
		const request ={uri: url};
		request.method = "POST";
		if (body) {
			request.body = body;
		}
		if (headers) {
			request.headers = headers;
		}
		if (isJson == null || isJson == undefined) {
			isJson = true;
		}
		if (!timeout) {
			timeout = 1000 * 90;
		}
		request.timeout = timeout;
		request.json = isJson;
		try {
			return await rp(request);
		} catch (err) {
			// console.log(err);
			return null;
		}
	},
};
