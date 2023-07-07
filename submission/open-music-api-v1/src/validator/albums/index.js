const {albumPayloadSchema} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumValidator = {
    validateAlbumPayload : (payload) => {
        const validationResult = albumPayloadSchema.validate(payload);

        if (validationResult.error){
            throw new InvariantError(validationResult.error.message);
        }
        return validationResult.value;
    },
};

module.exports = AlbumValidator;
