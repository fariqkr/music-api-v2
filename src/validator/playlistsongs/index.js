const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistsongPayloadSchema } = require("./schema");

const PlaylistsongsValidator = {
  validatePlaylistSongsPayload: (payload) => {
    const validationResult = PlaylistsongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsongsValidator;