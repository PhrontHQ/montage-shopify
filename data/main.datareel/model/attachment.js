var Montage = require("montage").Montage;

/**
 * @class Attachment
 * @extends Montage
 */


exports.Attachment = Montage.specialize(/** @lends Attachment.prototype */ {

    id: {
        value: undefined
    },
    url: {
        value: undefined
    },
    filename: {
        value: undefined
    },
    size: {
        value: undefined
    },
    type: {
        value: undefined
    },
    thumbnails: {
        value: undefined
    }

});