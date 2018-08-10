const router = require("./claudiaTest");

const burnRequest = {
	requestContext: {
		resourcePath: "/burn/kelsey/purple",
		httpMethod: "GET",
	},
	headers: {
		// Authorization:  "Token " + process.env.TEST_TOKEN,
		// "content-type": "application/json"
	},
};
const submitBurnRequest = {
	requestContext: {
		resourcePath: "/burn",
		httpMethod: "POST",
	},
	body: {
		sickBurn: "sick",
		phoneNumber: "+19717030195",
		burnType: {
			type: "sick",
			pet: {
				dtype: "Dog",
				name: "Fido",
				tailWagging: true,
			},
		},
	},
	headers: {
		potato: "yay",
		Authorization: "Token " + "123.123.123",
	},
};

router.proxyRouter(burnRequest,
	{
		done: function done(errorResponse: any, dataResponse: any) {
			console.log("API Test\n");
			console.log("Data:\n", (JSON as any).parse(dataResponse.body, null, 2), "\n Error: \n", errorResponse);
		},
	});
