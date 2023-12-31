// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// playlists songs
const playlistsSongs = require('./api/playlistsSongs');
const PlaylistsSongsService = require('./services/postgres/PlaylistsSongsService');
const PlaylistsongsValidator = require('./validator/playlistsongs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const playlistsSongsService = new PlaylistsSongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('musicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
        plugin: playlists,
        options: {
          service: playlistsService,
          validator: PlaylistsValidator,
        },
    },
    {
        plugin: playlistsSongs,
        options: {
          service: playlistsSongsService,
          validator: PlaylistsongsValidator,
        },
    },
    {
        plugin: songs,
        options: {
          service: songsService,
          validator: SongsValidator,
        },
    },
    {
        plugin: albums,
        options: {
          service: albumsService,
          validator: AlbumsValidator,
        },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
