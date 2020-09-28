import { Orm, DataTypes } from './Orm.js';
export default class Entity {

    // model name (defined in child classes)
    static model = undefined;

    // default fields for all entities
    static fields = {
        id: {
            type: DataTypes.UUIDV4,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        }
    }

    // sequelize mode instance (singleton)
    static definition = undefined;

    /**
     * Base constructor
     */
    constructor(properties = {}) {
        this.id = undefined;
        this.vo = properties;
    }

    /**
     * Default phrase filter
     *
     * @param phrase
     * @returns {{}}
     */
    static async phraseFilter(phrase) {
        return {true: true};
    }

    /**
     * Get value object
     */
    get vo() {
        return {...this};
    }

    /**
     * Set properties from value object
     *
     * @param properties
     */
    set vo(properties) {
        Object.assign(this, properties);
    }

    /**
     * Load from database
     *
     * @param id
     * @param include
     * @returns {Promise<boolean>}
     */
    async load(id, include = []) {
        try {
            const result = (await this.definition().findOne({where: {id}, include}));
            if (result !== null) {
                this.vo = result.dataValues;
                return true;
            }
        } catch(ex) {
            console.log(ex);
            this.exception(ex);
        }
        return false;
    }

    /**
     * Get all entities
     *
     * @param offset
     * @param limit
     * @param where
     * @param include
     * @returns {Promise<{offset: *, limit: *, totalRows: number, list: Model[]}>}
     */
    static async list({offset, limit, phrase = null, include = []}) {
        let where = await this.phraseFilter(phrase);
        if (phrase === null) where = {};
        const list = await this.orm().findAll({offset, limit, where, include});
        const totalRows = await this.orm().count();
        return {list, totalRows, offset, limit};
    }

    /**
     * Save entity to database
     *
     * @returns {Promise<any>}
     */
    async save() {
        // create
        try {
            if (typeof this.id === 'undefined') {
                this.vo = (await this.definition().create({...this.vo})).dataValues;
            } else {
                this.vo = (await this.definition().update(this.vo, {where: {id: this.id}})).dataValues;
            }
        } catch(ex) {
            console.log(ex);
            this.exception(ex);
        }

        return this.vo;
    }

    /**
     * Update partial data
     *
     * @returns {Promise<void>}
     * @param data
     */
    async set(data) {
        try {
            return await this.definition().update(
                data,
                { where: { id: this.id } }
            );
        } catch(ex) {
            this.exception(ex);
        }

    }

    /**
     * Delete customer by id
     *
     * @param id
     * @returns {Promise<void>}
     */
    static async delete(id) {
        return await this.orm().destroy({
            where: {
                id
            }
        });
    }

    /**
     * ORM definition
     *
     * @returns {*}
     */
    static orm(options = {timestamps: false}) {
        if (typeof this.definition === 'undefined')  {
            this.definition = Orm.define(this.model, this.fields, options);
        }
        return this.definition
    }

    /**
     * ORM definition of instance
     */
    definition() {
        return this.constructor.orm();
    }

    /**
     * ORM definition of instance
     */
    exception(ex) {
        throw ex;
    }
}