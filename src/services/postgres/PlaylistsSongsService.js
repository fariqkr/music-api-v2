const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const { mapPlaylistSongsDBToModel } = require('../../utils');
const playlists = require('../../api/playlists');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong({
    songId, userId, id
  }) {
    const playlistsSongsId = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists_songs VALUES($1, $2, $3) RETURNING id',
      values: [playlistsSongsId, id, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan ke Playlist');
    }

    return result.rows[0].id;
  }
  
  async getPlaylistsSongs(owner) {
    const query = {
      text: 'SELECT playlists_songs.*, playlists.*, songs.* FROM playlists_songs JOIN playlists ON playlists_songs.playlists_id = playlists.id JOIN songs ON playlists_songs.songs_id = songs.id WHERE playlists.owner = $1',
      values: [owner],
    };
    const result = await this._pool.query(query);
    const queryUsername = {
      text: 'SELECT playlists.*, users.username FROM playlists JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
      values: [owner],
    };
    const username = await this._pool.query(queryUsername);
    return {
      id: result.rows[0].playlists_id,
      name: result.rows[0].name,
      username: username.rows[0].username,
      songs: result.rows.map(mapPlaylistSongsDBToModel),
    };
  }


  async deletePlaylistSongById(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlists_songs WHERE songs_id = $1 AND playlists_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistId(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;