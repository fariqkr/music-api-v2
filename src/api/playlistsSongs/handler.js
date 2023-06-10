const ClientError = require('../../exceptions/ClientError');

class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { songId } = request.payload;
      const { id: credentialId} = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      await this._service.verifySongId(songId);


      const playlistSongId = await this._service.addPlaylistSong({
        songId, userId: credentialId, id: playlistId
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
        data: {
          playlistSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._service.verifyPlaylistOwner(playlistId, credentialId);
  
      const playlist = await this._service.getPlaylistsSongs(credentialId);
  
      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }

  }

  async deletePlaylistSongByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);

      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId} = request.auth.credentials;

      await this._service.verifyPlaylistOwner(playlistId, credentialId);
      // await this._service.verifySongId(songId);

      await this._service.deletePlaylistSongById(songId, playlistId);

      return {
        status: 'success',
        message: 'PlaylistSong berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongsHandler;