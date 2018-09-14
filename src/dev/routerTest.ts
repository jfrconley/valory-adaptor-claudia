const router = require("./claudiaTest");

const burnRequest = {
	requestContext: {
		resourcePath: "/burn",
		httpMethod: "GET",
	},
	headers: {
		Authorization:  "Token " + process.env.TEST_TOKEN,
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

const formRequest = {
    requestContext: {
        resourcePath: "/formtest",
        httpMethod: "POST",
    },
    post: {
        potato: "yay",
    },
    headers: {
        potato: "yay",
        Authorization: "Token " + "123.123.123",
    },
};

router.proxyRouter(burnRequest,
	{
		done: function done(errorResponse: any, dataResponse: any) {
			if (errorResponse) {
				console.error(errorResponse)
			}
			console.log("API Test\n");
			console.log("Data:\n", dataResponse.body, "\n Error: \n", errorResponse);
			console.log("Headers:\n", dataResponse.headers)
		},
	});
