import path from 'path'
import StringHelper from './helpers/StringHelper.js'
import Request from './Request.js'
import Response from './Response.js'

/**
 * REST API Application
 */
export default class AbstractApplication {

	/**
	 * Application constructor
	 *
	 * @param setup
	 * @param httpServer
	 * @param root
	 */
	constructor ({config, httpServer, root}) {

		if (new.target === 'AbstractApplication') {
			throw new TypeError("Cannot construct Abstract instances directly");
		}

		if (this.requestHandler === AbstractApplication.prototype.requestHandler) {
			throw new TypeError("Must override method requestHandler");
		}

		if (this.responseHandler === AbstractApplication.prototype.responseHandler) {
			throw new TypeError("Must override method responseHandler");
		}

		if (this.errorHandler === AbstractApplication.prototype.errorHandler) {
			throw new TypeError("Must override method responseHandler");
		}

		// configuration
		this.config = config
		this.root = root;

		// detecting version
		this.version = path.basename(root)

		// create http server
		this.httpServer = httpServer
		this.httpServerRequest = undefined;
		this.httpServerResponse = undefined;

		// define pattern of routes
		this.patternUrl = `/api/${this.version}/:controller/:action?`
	}

	/**
	 * Handler for requests
	 *
	 * @param request
	 * @returns {Request}
	 */
	requestHandler(request) {
		throw new TypeError("Do not call abstract method foo from child.");
	}

	/**
	 * Handler for responses
	 *
	 * @param response
	 */
	responseHandler(response) {
		throw new TypeError("Do not call abstract method foo from child.");
	}

	/**
	 * Handler for responses
	 *
	 * @param response
	 */
	errorHandler(response) {
		throw new TypeError("Do not call abstract method foo from child.");
	}
	/**
	 * Call to controller
	 *
	 * @returns {Promise<*>}
	 * @param app
	 */
	async call (app) {
		return async function(httpServerRequest, httpServerResponse) {
			app.httpServerRequest = httpServerRequest;
			app.httpServerResponse = httpServerResponse;

			// get path to controller
			const controllerPath = `${app.root}/${httpServerRequest.params.controller}/${StringHelper.capitalize(httpServerRequest.params.controller)}Controller.js`
			console.log('Client trying access to ' + controllerPath)

			const request = app.requestHandler(app.httpServerRequest);

			// check if controllers exists
			try {

				// resolve controller
				const actionName = request.params.action || 'default'
				const actionMethod = request.method + StringHelper.capitalize(actionName)

				console.log('Dynamic importing controller ' + controllerPath)
				const ControllerModule = (await import(controllerPath)).default

				// create controller
				const controller = new ControllerModule(request)

				// resolve action
				let action = null
				const tryFirst = actionMethod
				const trySecond = request.method + 'Item'

				if (typeof controller[tryFirst] !== 'undefined') {
					action = tryFirst
				}
				else if (typeof controller[trySecond] !== 'undefined') {
					action = trySecond
				}

				if(action !== null) {
					console.log(`${request.method} > ${request.params.controller} > ${action} > ${actionName}`)

					// validate the request body
					const valid = true
					const validAction = 'valid' + StringHelper.capitalize(action)

					// check if action have validation
					if (typeof (controller[validAction]) !== 'undefined') {
						const { error } = controller[validAction]().validate(request.body)
						console.log(error)

						if (typeof error !== 'undefined') {
							return app.errorHandler(error)
						}
					}

					// execute if is valid request
					if (valid) {
						let response = await controller[action]()
						return app.responseHandler(response)
					}
				}

			} catch (ex) {
				console.log(ex)
				return app.errorHandler(ex)
			}

			return app.responseHandler(new Response({
				status: 400,
				body: {
					message: 'Bad request'
				}
			}));
		}
	}

	/**
	 * Route to controller
	 */
	async routing () {
		return this.httpServer.all(this.patternUrl, await this.call(this))
	}

	/**
	 * Start HTTP server
	 */
	startServer () {
		console.log(`Starting REST API ${this.version} listen ${this.patternUrl} on directory ${this.root}`)
		this.httpServer.listen(this.config.http.port, () => {
			console.log('Magaya Orders Server Started at localhost:' + this.config.http.port)
		})
	}

	/**
	 * Run application
	 */
	async run () {
		// routing
		await this.routing()

		// start http server
		this.startServer()
	}
}
