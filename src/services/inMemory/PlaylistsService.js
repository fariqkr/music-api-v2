const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._playlists = [];
  }

  addPlaylist({ name }) {
    const id = nanoid(16);

    const newPlaylist = {
      name, id
    };

    this._playlists.push(newPlaylist);

    const isSuccess = this._playlists.filter((playlist) => playlist.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return id;
  }

  getPlaylists() {
    return this._playlists;
  }

  getPlaylistById(id) {
    const playlist = this._playlists.filter((n) => n.id === id)[0];
    if (!playlist) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return playlist;
  }

  editPlaylistById(id, { name }) {
    const index = this._playlists.findIndex((playlist) => playlist.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui playlist. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._playlists[index] = {
      ...this._playlists[index],
      name,
    };
  }

  deletePlaylistById(id) {
    const index = this._playlists.findIndex((playlist) => playlist.id === id);
    if (index === -1) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
    this._playlists.splice(index, 1);
  }
}

module.exports = PlaylistsService;