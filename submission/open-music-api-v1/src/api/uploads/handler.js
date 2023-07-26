const autoBind = require('auto-bind'); //? use autobind

class UploadsHandler {
  constructor(service, AlbumService, validator) {
    this._service = service;
    this._albumService = AlbumService;
    this._validator = validator;

    autoBind(this);
  }

  async postCoverAlbumByIdHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;
    this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi, id);

    await this._albumService.editCoverAlbumById(id, filename);
    const response = h.response({
      status: 'success',
      message: 'Albums uploaded successfully',
    });
    response.code(201);
    return response;
  }
}

module.exports = { UploadsHandler };