/**
 * HTTP Response
 */
export default class Response {

	status = 200

	/**
	 * Request constructor
	 *
	 * @param status
	 * @param params
	 * @param body
	 * @param headers
	 */
	constructor({status = 200, params = {}, body = {}, headers = []}) {
		this.status = status;
		this.params = params;
		this.body = body;
		this.headers = headers;
	}
}