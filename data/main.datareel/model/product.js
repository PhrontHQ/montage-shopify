var Montage = require("montage").Montage,
    OrderLineItem = require("./order-line-item").OrderLineItem;

/**
 * @class Product
 * @extends Montage
 */



exports.Product = Montage.specialize(/** @lends Product.prototype */ {

    name: {
        value: undefined
    },
    orders: {
        value: undefined
    },
    _pictures: {
        value: null
    },

    pictures: {
        get: function () {
            return this._pictures;
        },
        set: function (value) {
            if (this._pictures !== value) {
                this._pictures = value;
            }
        }
    },
    description: {
        value: undefined
    },
    link: {
        value: undefined
    },
    type: {
        value: undefined
    },            
    unitCost: {
        value: undefined
    },
    settings: {
        value: undefined
    },            
    sizeWxLxH: {
        value: undefined
    },            
    notes: {
        value: undefined
    },            
    schematics: {
        value: undefined
    },            
    _vendors: {
        value: null
    },

    vendors: {
        get: function () {
            return this._vendors;
        },
        set: function (value) {
            if (this._vendors !== value) {
                this._vendors = value;
            }
        }
    },
    inStock: {
        get: function () {
            return this._inStock;
        },
        set: function (value) {
            if (this._inStock !== value) {
                this._inStock = value;
            }
        }
    },

    _inStock: {
        value: undefined
    },            
    totalUnitsSold: {
        value: undefined
    },            
    grossSales: {
        value: undefined
    }       

});