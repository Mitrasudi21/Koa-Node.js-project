/* eslint-disable linebreak-style */
/* eslint no-unreachable: 0 */
/* eslint no-console: 0 */

const Koa = require("koa");
const Router = require("koa-router");
const Cors = require("@koa/cors");
const BodyParser = require("koa-better-body");
const Helmet = require("koa-helmet");
const respond = require("koa-respond");
const serve = require("koa-static");
const views = require("koa-views");
const session = require("koa-session");
const conditional = require("koa-conditional-get");
const etag = require("koa-etag");
const formidable = require("formidable");


const app = new Koa();

app.use(conditional());
app.use(etag());
app.use(serve("assets", {maxage: 1000 * 60 * 60 * 24 * 15}));
const router = new Router();

koaApp.appPath = __dirname;


app.keys = ["17f3d248-23b8-11e8-b467-0ed5f89f718b"];

const SESSION_CONFIG = {
	maxAge: koaApp.isClientMode?(8 * 60 * 60 * 1000):(30 * 60 * 1000),
};

app.use(session(SESSION_CONFIG, app));

const viewUtil = require("./config/view");

app.use(Helmet({
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			scriptSrcAttr: "'unsafe-inline'",
			scriptSrc: ["'self'", "'nonce-2726c7f26c'"],
			// objectSrc: "'unsafe-inline'",
			// scriptSrcElem: "'unsafe-inline'",
		},
	},
}));

app.use(Cors());

app.use(respond());

app.use(views("views", {
	map: {
		hbs: "handlebars",
	},
	extension: "hbs",
	options: {
		partials: viewUtil.partials,
		helpers: viewUtil.helpers,
	},
}));

app.use(async function(ctx, next) {
	if (!ctx.renderView) {
		ctx.renderView = function(view, viewData) {
			if (!viewData) {
				viewData = {};
			}
			viewData["view"] = {path: view};
			viewData["session"] = ctx.session;
			viewData["koaApp"] = koaApp;
			return ctx.render(view, viewData);
		};
	}
	await next();
});

app.use(async function errorHandler(ctx, next) {
	try {
		await next();
		const status = ctx.status || 404;
		if (status === 404 || status === 403 || status === 500) {
			throw {status: status};
		} else if (status === 405) {
			throw {status: 403};
		}
	} catch (err) {
		if (err.status === 404) {
			ctx.status = err.status;
			switch (ctx.accepts("html", "json")) {
			case "html":
				return ctx.renderView("404");
				break;
			case "json":
				ctx.type = "json";
				ctx.body = {
					status: false,
					msg: "Not Found",
				};
				break;
			default:
				ctx.type = "text";
				ctx.body = "Page Not Found";
			}
		} else if (err.status === 403) {
			ctx.status = 403;
			var redirect = err.redirect;
			if (redirect) {
				return ctx.redirect(redirect);
			}
			switch (ctx.accepts("html", "json")) {
			case "html":
				return ctx.renderView("403");
				break;
			case "json":
				ctx.status = err.contextStatus || 403;
				ctx.type = "json";
				ctx.body = {
					status: false,
					msg: "You don't have permission",
				};
				break;
			default:
				ctx.type = "text";
				ctx.body = "You don't have permission";
			}
		} else {
			console.log(err);
			ctx.status = 500;
			switch (ctx.accepts("html", "json")) {
			case "html":
				return ctx.renderView("500");
				break;
			case "json":
				ctx.type = "json";
				ctx.body = {
					status: false,
					msg: "Internal Server Error",
				};
				break;
			default:
				ctx.type = "text";
				ctx.body = "Internal Server Error";
			}
		}
		return;
	}
});
const path = require("path");
const incomingForm = new formidable.IncomingForm();
incomingForm.uploadDir = path.join(__dirname, "uploads");
incomingForm.keepExtensions = true;

incomingForm.on("error", function() {

});

incomingForm.on("aborted", function() {

});

const convert = require("koa-convert");

app.use(convert(BodyParser({
	jsonLimit: "10mb",
	formLimit: "10mb",
	strict: true,
	IncomingForm: incomingForm,
	onerror: function(err, ctx) {
		throw err;
	},
})));

require("./config/mongoDb")(app);

const Policies = require("./config/policy");
app.use(Policies.policyHandler);

// API routes
require("./routes")(router);
app.use(router.routes());
app.use(router.allowedMethods());

require("./config/misc");

app.on("error", function() {
});
const ALLOW_SYNC = false;
if (koaApp.isClientMode && ALLOW_SYNC) {
	const syncService = require("./services/syncService")(app.context);
	try {
		setTimeout(function() {
			try {
				syncService.uploadData();
			} catch (e) {
				console.log(e);
			}
		}, 15 * 60 * 1000);
		setInterval(function() {
			try {
				syncService.uploadData();
			} catch (e) {
				//
			}
		}, 30 * 60 * 1000);
	} catch (err) {
		//
	}
}

module.exports = app;
