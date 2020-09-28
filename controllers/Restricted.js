/**
 * Base controller
 */
import Controller from './Controller.js'
import jwt from 'jsonwebtoken'

export default class Restricted extends Controller {

	/**
	 * Constructor
	 *
	 * @param request
	 */
	constructor(request) {
		super(request)
		this.checkAuth()
	}

	/**
	 * Check authentication
	 *
	 * @returns {boolean}
	 */
	checkAuth() {

		// Authorization: Bearer JWT_ACCESS_TOKEN
		const authHeader = this.request.headers['authorization']
		const token = authHeader && authHeader.split(' ')[1]

		if(token !== null) {
			try {
				this.username = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
				return true
			} catch(ex) {
				throw {
					code: 400,
					message: 'Invalid token'
				}
			}
		}

		throw {
			code: 401,
			message: 'Acccess denied'
		}
	}
}
