class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    // ? private property
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  // ? cek validasi token
  async postAuthenticationHandler(request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload); // ? cek request payload

    const { username, password } = request.payload; // ? get prop
    const id = await this._usersService.verifyUserCredential(
      username,
      password,
    );

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken); // ? save refresh token to db

    // ? creat response token on body
    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  // ? generete new token
  async putAuthenticationHandler(request) {
    this._validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload; // ? get prop
    await this._authenticationsService.verifyRefreshToken(refreshToken); // ? cek refreshToken on db
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken); // ? untuk membuat accessToken baru

    // ? generete newToken
    const accessToken = this._tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  // ? delete token pada db
  async deleteAuthenticationHandler(request) {
      this._validator.validateDeleteAuthenticationPayload(request.payload); // ? joi valid request payload

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken); // ? cek refreshtoken on db
      await this._authenticationsService.deleteRefreshToken(refreshToken); // ? delete token on db

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      };
  }
}
module.exports = AuthenticationsHandler;
