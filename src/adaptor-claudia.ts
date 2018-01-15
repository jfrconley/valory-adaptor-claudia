import {ApiExchange, ApiServer, HttpMethod, ValoryMetadata} from "valory";
const ApiBuilder = require("claudia-api-builder");

export class ClaudiaAdaptor implements ApiServer {
	public allowDocSite: boolean = true;
	private instance = new ApiBuilder();
	private response: any = null;

	constructor() {
		this.response = new this.instance.ApiResponse(null, null, null);
	}

	public register(path: string, method: HttpMethod,
					handler: (request: ApiExchange) => ApiExchange | Promise<ApiExchange>): void {
		const responseObj = this.response;
		const stringMethod = HttpMethod[method].toLowerCase();
		this.instance[stringMethod](path, async (req: any) => {
				const tranReq: ApiExchange = {
					attachments: {},
					body: req.body,
					headers: req.normalizedHeaders,
					statusCode: 200,
					query: req.queryString,
					formData: req.post,
					path: req.pathParams,
					route: `${path}:${stringMethod}`,
				};

				const handlerResp = await handler(tranReq);
				responseObj.response = handlerResp.body;
				responseObj.headers = handlerResp.headers;
				responseObj.code = handlerResp.statusCode;
				return responseObj;
			});
	}

	public getExport(metadata: ValoryMetadata, options: any): {valory: ValoryMetadata} {
		this.instance.valory = metadata;
		return (this.instance as any);
	}

	public shutdown(): void {
		return null;
	}
}