import Restricted from './Restricted.js'
import Response from '../app/Response.js'

export default class Report extends Restricted {

	static model = undefined

	/**
	 * Get all customers
	 *
	 * @returns {Promise<Response>}
	 */
	async getDefault() {

		// get params
		const { offset = 0, limit = 100, phrase = null } = this.request.query

		// load from database
		const result = await this.constructor.model.list({ offset, limit, phrase })

		// return response
		return new Response({
			body: result
		})
	}

	/**
	 * Get customer
	 *
	 * @returns {Promise<Response>}
	 */
	async getItem() {

		let item = new this.constructor.model()
		const result = await item.load(this.request.params.action)

		if(result) {
			return new Response({
				body: item
			});
		} else {
			return new Response({
				status: 404,
				body: {
					message: 'Not found'
				}
			})
		}
	}
}