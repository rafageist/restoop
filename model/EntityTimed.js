import Entity from './Entity.js'

/**
 * Entity with timestamps
 */
export default class EntityTimed extends Entity {

	/**
	 * ORM definition
	 *
	 * @returns {*}
	 */
	static orm() {
		return super.orm({
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		});
	}
}