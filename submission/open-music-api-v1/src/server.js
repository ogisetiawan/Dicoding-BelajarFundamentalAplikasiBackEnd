// ? import dotenv dan menjalankan konfigurasinya .env
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert'); //? hapi statis file
const path = require('path');

// @ Album Service
const albums = require('./api/albums');
const AlbumService = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');

// @ Song Service
const songs = require('./api/songs');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/songs');

// @ Exceptions
const ClientError = require('./exceptions/ClientError');

//@ User Service
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

//@ Authentications Service
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

//@ Playlists Service
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsSongsService = require('./services/postgres/PlaylistsSongsService');
const PlaylistsSongsActivitiesService = require('./services/postgres/PlaylistsSongsActivitiesService');
const playlistsValidator = require('./validator/playlists');

//@ Collaborations Service
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

//@ Exports Service
const _exports = require('./api/exports'); //? _export obj global
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

//@ Uploads Service
const uploads = require('./api/uploads');
const { StorageService } = require('./services/storage/storageService');
const { UploadsValidator } = require('./validator/uploads');

const CacheService = require('./services/redis/cacheService');

const init = async () => {
  // ? initPlugin
  const cacheService = new CacheService();
  const albumService = new AlbumService(cacheService);
  const songService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistsSongsService = new PlaylistsSongsService();
  const playlistsSongsActivitiesService = new PlaylistsSongsActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  //? regist plugin external
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  //? mendefinisikan strategy autentikasi jwt
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY, //? merupakan key atau kunci dari token JWT-ny
    verify: {
      aud: false, //? nilai audience dari token, false aud tidak akan diverifikasi.
      iss: false, //? nilai issuer dari token
      sub: false, //? nilai subject dari token
      maxAgeSec: process.env.ACCESS_TOKEN_AGE, //? nilai number yang menentukan umur kedaluwarsa dari token.
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id, //? id_user yang terautentifikasi
      },
    }),
  });

  // ? regist plugin
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService, //? call handler
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
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
    {
      plugin: playlists,
      options: {
        PlaylistsService: playlistsService,
        PlaylistsSongsService: playlistsSongsService,
        PlaylistsSongsActivitiesService: playlistsSongsActivitiesService,
        PlaylistsValidator: playlistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        CollaborationsService: collaborationsService,
        PlaylistsService: playlistsService,
        CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        ProducerService,
        PlaylistsService: playlistsService,
        ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        AlbumService: albumService,
        validator: UploadsValidator,
      },
    },
  ]);


  // ? boilerplate code
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Sorry, There was a failure on our server',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
