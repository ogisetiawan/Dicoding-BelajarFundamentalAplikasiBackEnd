//? import dotenv dan menjalankan konfigurasinya .env
require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

//@ Notes API
const notes = require("./api/notes"); //? call service from api
// const NotesService = require('./services/inMemory/NotesService'); //? service from api
const NotesService = require("./services/postgres/NotesService"); //? service from postgres db
const NotesValidator = require("./validator/notes");

//@ users API
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

//@ authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

//@ collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  // ? instance service
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  //? regist plugin external
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  //? mendefinisikan strategy autentikasi jwt
  server.auth.strategy("notesapp_jwt", "jwt", {
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
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: CollaborationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
