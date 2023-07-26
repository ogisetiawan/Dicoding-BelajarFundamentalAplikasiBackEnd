const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumService {
  constructor() {
    this._pool = new Pool();
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
}

module.exports = AlbumService;
