/**
 * HTTP Request
 */
export default class Request {

	/**
	 * Request constructor
	 * @param method
	 * @param query
	 * @param params
	 * @param body
	 * @param headers
	 */
	constructor({method = 'get', query = {}, params = {}, body = {}, headers = []}) {
		this.method = method.toLowerCase()
		this.query = query
		this.params = params;
		this.body = body;
		this.headers = headers;
	}
}