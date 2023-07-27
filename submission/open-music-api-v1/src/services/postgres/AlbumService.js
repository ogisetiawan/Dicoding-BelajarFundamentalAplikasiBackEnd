const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const ClientError = require('../../exceptions/ClientError');

class AlbumService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album cannot added!');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) { //? get from api handler
    const queryAlbum = {
      text: 'SELECT id, name, year, cover FROM albums WHERE id = $1',
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album not found!');
    }

    //? check coverAlbum
    if (resultAlbum.rows[0].cover !== null) {
      resultAlbum.rows[0].cover = `http://${process.env.HOST}:${process.env.PORT}/albums/cover/${resultAlbum.rows[0].cover}`;
    }

    const querySong = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1',
      values: [id],
    };

    const resultSong = await this._pool.query(querySong);

    return { album: resultAlbum.rows[0], songs: resultSong.rows };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Failed to update album. ID not found');
    }
  }

  async editCoverAlbumById(id, coverAlbum) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [coverAlbum, id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Failed update album. Id not found.');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Album failed to delete. ID not found');
    }
  }

  async likeAlbum(albumId, userId) {
    let query = {
      text: "SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2",
      values: [albumId, userId],
    };
    const { rowCount } = await this._pool.query(query);

    if (rowCount > 0) {
        throw new ClientError("Album telah disukai");
    }

    const id = `like-${nanoid(16)}`;
    query = {
      text: 'INSERT INTO album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Gagal menyukai album.');
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async dislikeAlbum(albumId, userId) {
    const query = {
      text: "DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id",
      values: [albumId, userId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }

    await this._cacheService.delete(`notelikes:${albumId}`);
  }

  async getAlbumLikes(id) {
    try {
      const result = await this._cacheService.get(`notelikes:${id}`);
      return [JSON.parse(result), true];
    } catch (error) {
      const query = {
        text: "SELECT COUNT(id) FROM album_likes WHERE album_id = $1",
        values: [id],
      };
      const likes = (await this._pool.query(query)).rows[0].count;
      await this._cacheService.set(
        `notelikes:${id}`,
        JSON.stringify(likes),
        1800
      );

      return [likes, false];
    }
  }

  async verifyAlbum(id) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [id],
    };
    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }
}

module.exports = AlbumService;
