import Entity from './EntityBase.js'

/**
 * Entity with timestamps
 */
export default class EntityTimedBase extends Entity {

	/**
	 * ORM definition
	 *
	 * @returns {*}
	 */
	static orm() {
		return super.orm(this.config, {
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		});
	}
}