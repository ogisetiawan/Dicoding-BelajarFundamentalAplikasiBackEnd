//? import dotenv dan menjalankan konfigurasinya .env
require('dotenv').config();

const Hapi = require('@hapi/hapi');

//@ Notes API
const notes = require('./api/notes');
// const NotesService = require('./services/inMemory/NotesService'); //? service from api
const NotesService = require('./services/postgres/NotesService'); //? service from postgres db
const NotesValidator = require('./validator/notes');

//@ users API
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const notesService = new NotesService();
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

  //? regist plugin
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService, //? set plugin
        validator: NotesValidator, //? set validator
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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
