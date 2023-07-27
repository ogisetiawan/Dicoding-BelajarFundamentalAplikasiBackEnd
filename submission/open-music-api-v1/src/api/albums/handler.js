// eslint-disable-next-line linebreak-style
const { mapDBToAlbumSongService } = require('../../utils/index');

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postAlbumHandler(request, h) {
    const albumValidated = this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.addAlbum(albumValidated);

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id); //?call service
    const resultMappingAlbum = mapDBToAlbumSongService(album.album, album.songs);

    const response = h.response({
      status: 'success',
      data: {
        album: resultMappingAlbum,
      },
    });
    return response;
  }

  async editAlbumHandler(request, h) {
    const albumValidated = this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, albumValidated);

    const response = h.response({
      status: 'success',
      message: 'Album updated successfully',
    });
    return response;
  }

  async deleteAlbumHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album deleted successfully',
    });
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyAlbum(albumId);
    await this._service.likeAlbum(albumId, credentialId);

    const response = h.response({
      status: "success",
      message: "Album berhasil disukai",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.dislikeAlbum(albumId, credentialId);

    return {
      status: "success",
      message: "Suka terhadap album berhasil dihapus",
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const res = await this._service.getAlbumLikes(albumId);
    const likes = Number(res[0]);

    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });
    if (res[1]) response.header("X-Data-Source", "cache");

    return response;
  }
}

module.exports = AlbumHandler;
