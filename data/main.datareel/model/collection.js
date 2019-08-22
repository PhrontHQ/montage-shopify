var Montage = require("montage").Montage;

/**
 * @class Collection
 * Models https://help.shopify.com/en/api/graphql-admin-api/reference/object/collection
 * @extends Montage
 */


exports.Collection = Montage.specialize(/** @lends Collection.prototype */ {

    title: {
        value: undefined
    },
    description: {
        value: undefined
    },
    descriptionHtml: {
        value: undefined
    },
    image: {
        value: undefined
    },
    ruleSet: {
        value: undefined
    },
    products: {
        value: undefined
    }

});