import {ApiMiddleware, ErrorDef, Valory, Swagger} from "valory-runtime";
import {ClaudiaAdaptor} from "../adaptor-claudia";

const info: Swagger.Info = {
	title: "Test api",
	version: "1",
};

const definitions = {
	Animal: {
		discriminator: "dtype",
		required: [
			"dtype",
			"name",
		],
		properties: {
			dtype: {
				type: "string",
			},
			name: {
				type: "string",
				minLength: 4,
				maxLength: 20,
			},
		},
	},
	Cat: {
		allOf: [
			{
				$ref: "#/definitions/Animal",
			},
			{
				type: "object",
				required: [
					"huntingSkill",
				],
				properties: {
					huntingSkill: {
						type: "string",
						enum: [
							"clueless",
							"lazy",
							"adventurous",
							"aggressive",
						],
					},
				},
			},
		],
	},
	Monkey: {
		allOf: [
			{
				$ref: "#/definitions/Animal",
			},
			{
				type: "object",
				required: [
					"numberOfFleas",
				],
				properties: {
					numberOfFleas: {
						type: "number",
						minimum: 0,
					},
				},
			},
		],
	},
	Dog: {
		allOf: [
			{
				$ref: "#/definitions/Animal",
			},
			{
				type: "object",
				required: [
					"tailWagging",
				],
				properties: {
					tailWagging: {
						type: "boolean",
					},
				},
			},
		],
	},
	BurnSubmit: {
		type: "object",
		required: [
			"sickBurn",
			"burnType",
		],
		properties: {
			sickBurn: {
				type: "string",
			},
			burnType: {
				type: "object",
				required: [
					"type",
					"pet",
				],
				properties: {
					type: {
						type: "string",
						enum: [
							"sick",
						],
					},
					pet: {
						$ref: "#/definitions/Animal",
					},
				},
			},
			phoneNumber: {
				type: "string",
				pattern: "^\\+?[1-9]\\d{1,14}$",
			},
		},
	},
};

const errors: {[name: string]: ErrorDef} = {
	AccessDenied: {
		statusCode: 401,
		errorCode: 1004,
		defaultMessage: "Access to this resource is denied",
	},
};

const api = Valory.createInstance({
    server: new ClaudiaAdaptor(),
    info,
    errors,
});

// api.addGlobalMiddleware(TestMiddleware);

api.get("/burn", {
	description: "Awful, horrible burns",
	summary: "Get burned",
	responses: {
		200: {
			description: "Returns a thing",
		},
	},
	parameters: [
		{
			required: true,
			type: "string",
			in: "header",
			name: "authorization",
			description: "JWT required",
		},
	],
}, (req) => {
	return {
        body: "{\"msg\":\"yay\"}",
		statusCode: 200,
		headers: {"Content-Type": "application/json", "potato": true},
	};
});

api.get("/burn/{name}/{hairColor}", {
	description: "Burn someone",
	summary: "Burn someone by name",
	parameters: [
		{
			name: "name",
			in: "path",
			required: true,
			type: "string",
			description: "Name of person to burn",
		},
		{
			name: "hairColor",
			in: "path",
			required: true,
			type: "string",
			description: "Hair color of the person",
		},
	],
	responses: {
		200: {
			description: "Returns a thing",
		},
	},
}, (req, logger) => {
	return {
		body: `${req.path.name}, only you would have a hair color as lame as ${req.path.hairColor}`,
		statusCode: 401,
		headers: {},
	};
});

api.post("/formtest", {
	description: "Awful, horrible burns",
	summary: "Submit a burn for evaluation",
	parameters: [
		{
			in: "formData",
			name: "potato",
			required: true,
			type: "string",
		},
	],
	responses: {
		200: {
			description: "Returns a thing",
		},
	},
}, (req, logger) => {
	// logger.info(req);

	return {
		body: {msg: "yay"},
		statusCode: 401,
		headers: {},
	};
});

const router: any = api.start({});
export = router;
