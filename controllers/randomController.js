// module.exports = {
// 	randomNumber: (ctx) => {
// 		const num = Math.floor(Math.random()*9000) + 1000;
// 		return ctx.ok({status: true, msg: "OK", number: num});
// 	},
// };

module.exports = {
	randomNumber: (ctx) => {
		const num = Math.floor(Math.random()*1000) + 7000;
		return ctx.ok({status: true, msg: "OK", number: num});
	},
};


