import Restricted from './Restricted.js'
import Response from '../../framework/Response.js'

export default class Crud extends Restricted {

	static model = undefined

	/**
	 * Get all customers
	 *
	 * @returns {Promise<Response>}
	 */
	async getDefault() {

		const { offset = 0, limit = 100, phrase = null } = this.request.query
		const result = await this.constructor.model.list({ offset, limit, phrase })

		return new Response({
			status: 200,
			body: result
		})
	}

	/**
	 * Create customer
	 *
	 * @returns {Promise<Response>}
	 */
	async postDefault() {
		let item = new this.constructor.model(this.request.body)

		await item.save()

		if (item) {
			return new Response({
				status: 201,
				body: item
			})
		}

		throw {
			code: 500,
			message: 'Error creating ' + this.constructor.model
		}
	}

	/**
	 * Get customer
	 *
	 * @returns {Promise<Response>}
	 */
	async getItem() {

		// create the entity
		let item = new this.constructor.model()

		// load from database
		const result = await item.load(this.request.params.action)

		if(result) {
			return new Response({
				body: item
			})
		}

		return new Response({
			status: 404,
			body: {
				message: 'Not found'
			}
		})
	}

	/**
	 * Partial update
	 *
	 * @returns {Promise<Response>}
	 */
	async patchItem() {

		// create entity
		let item = new this.constructor.model()

		// load from database
		const result = await item.load(this.request.params.action)

		// if found
		if(result) {
			// update
			await item.set(this.request.body)

			// reload
			await item.reload()

			return new Response({
				body: item
			})
		}

		return new Response({
			status: 404,
			body: {
				message: 'Not found'
			}
		})

	}

	/**
	 * Delete customer
	 *
	 * @returns {Promise<Response>}
	 */
	async deleteItem() {

		// delete entity
		const id = this.request.params.action
		const result = await this.constructor.model.delete(id)

		// check affected rows
		if(result === 0) {
			return new Response({
				status: 404,
				body: {
					deleted: false,
					affectedRows: 0
				}
			})
		}

		return new Response({
			body: {
				deleted: true,
				affectedRows: result
			}
		})
	}
}