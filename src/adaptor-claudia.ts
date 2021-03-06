import {ApiResponse, ApiServer, HttpMethod, ValoryMetadata, ApiRequest, AttachmentKey} from "valory-runtime";

const ApiBuilder = require("claudia-api-builder");

export interface ClaudiaContext {
	method: string;
	path: string;
	stage: string;
	sourceIp: string;
	accountId?: string;
	user?: string;
	userAgent: string;
	userArn?: string;
	caller?: string;
	apiKey: string;
    authorizerPrincipalId?: string;
    cognitoAuthenticationProvider?: string
    cognitoAuthenticationType?: string;
    cognitoIdentityId?: string;
    cognitoIdentityPoolId?: string
}

export class ClaudiaAdaptor implements ApiServer {
	public static ClaudiaContextKey = ApiRequest.createKey<ClaudiaContext>();
	public allowDocSite: boolean = true;
	public locallyRunnable: boolean = false;
    private headerOverride: {success: {headers: {[name: string]: string}}} = {success: {headers: {"content": ""}}};
    private instance = new ApiBuilder();
    private response: any = null;

	constructor() {
		this.response = new this.instance.ApiResponse(null, null, null);
		this.instance.setGatewayResponse("DEFAULT_4XX", {
			headers: {
				"Content-Type": "application/json",
			},
			statusCode: 404,
			responseTemplates: {
				"application/json": `{"message": "Not Found"}`,
			},
		});
	}

	public register(path: string, method: HttpMethod,
					handler: (request: ApiRequest) => Promise<ApiResponse>): void {
		const responseObj = this.response;
		const stringMethod = HttpMethod[method].toLowerCase();
		this.instance[stringMethod](path, (req: any) => {
			const tranReq = new ApiRequest({
				body: req.body,
				rawBody: req.rawBody,
				headers: req.normalizedHeaders,
				query: req.queryString,
				formData: req.post,
				path: req.pathParams,
				route: `${path}:${stringMethod}`,
			});
			tranReq.putAttachment(ClaudiaAdaptor.ClaudiaContextKey, req.context);

			return handler(tranReq).then((handlerResp) => {
				if (handlerResp.headers["Content-Type"] === "application/json" && typeof handlerResp.body === "string") {
                    this.headerOverride.success.headers = handlerResp.headers;
                    let counter = 0;
                    responseObj.headers = {
                        get "Content-Type"() {
                            counter++;
                            return (counter == 1) ? "text/plain" : "application/json"
                        }
                    };
				} else {
                    responseObj.headers = handlerResp.headers;
                }
                responseObj.response = handlerResp.body;
                responseObj.code = handlerResp.statusCode;
                return responseObj;
			});
		}, this.headerOverride);
	}

	public getExport(metadata: ValoryMetadata, options: any): { valory: ValoryMetadata } {
		this.instance.valory = metadata;
		return (this.instance as any);
	}

	public shutdown(): void {
		return null;
	}
}
