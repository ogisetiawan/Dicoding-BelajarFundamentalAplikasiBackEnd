const ClientError = require("../../exceptions/ClientError");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    //? private property
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    //? binding function
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  //? cek validasi token
  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload); //? cek request payload

      const { username, password } = request.payload; //? get prop
      const id = await this._usersService.verifyUserCredential(
        username,
        password
      );

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken); //? save refresh token to db

      //? creat response token on body
      const response = h.response({
        status: "success",
        message: "Authentication berhasil ditambahkan",
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //? generete new token
  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);
 
      const { refreshToken } = request.payload; //? get prop
      await this._authenticationsService.verifyRefreshToken(refreshToken); //? cek refreshToken on db
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken); //? untuk membuat accessToken baru

      //? generete newToken 
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  //? delete token pada db
  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload); //? joi valid request payload
      
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken); //? cek refreshtoken on db
      await this._authenticationsService.deleteRefreshToken(refreshToken); //? delete token on db
      
      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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
module.exports = AuthenticationsHandler;
