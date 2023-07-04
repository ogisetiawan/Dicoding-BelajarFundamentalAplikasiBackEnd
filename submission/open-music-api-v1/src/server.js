// ? import dotenv dan menjalankan konfigurasinya .env
require('dotenv').config();

const Hapi = require('@hapi/hapi');

// @ Album Service
const albums = require('./api/albums');
const AlbumService = require('./services/albums/AlbumService');
const { AlbumValidator } = require('./validator/albums');

// @ Song Service
const songs = require('./api/songs');
const SongService = require('./services/songs/SongService');
const { SongValidator } = require('./validator/songs');

// @ Exceptions
const ClientError = require('./exceptions/ClientError');

//@ User Service
const users = require("./api/users");
const UsersService = require("./services/users/UsersService");
const UsersValidator = require("./validator/users");

const init = async () => {
  // ? initPlugin
  const albumService = new AlbumService();
  const albumValidator = new AlbumValidator();
  const songService = new SongService();
  const songValidator = new SongValidator();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // ? regist plugin
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: albumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: songValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
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
