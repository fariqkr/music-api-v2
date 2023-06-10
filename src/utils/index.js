const mapDBToModel = ({
  id,
  name,
  username,
}) => ({
  id,
  name,
  username,
});

const mapAlbumsDBToModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapPlaylistSongsDBToModel = ({
  id,
  title,
  performer
}) => ({
  id,
  title,
  performer
});


const mapSongDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapSongsDBToModel = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModel, mapSongDBToModel, mapSongsDBToModel, mapPlaylistSongsDBToModel, mapAlbumsDBToModel };
