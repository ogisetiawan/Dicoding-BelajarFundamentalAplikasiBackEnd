const { Pool } = require("pg"); // ? pool auto
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const NotFoundError = require("../../exceptions/NotFoundError");

class NotesService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService; //? dependency injection CollaborationService
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: "SELECT * FROM notes WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async addNote({ title, body, tags, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // ? object query
    const query = {
      text: "INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, body, tags, createdAt, updatedAt, owner],
    };

    const result = await this._pool.query(query); // ? excute query pg

    if (!result.rows[0].id) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getNotes(owner) {
    const query = {
      text: `SELECT notes.* FROM notes
      LEFT JOIN collaborations ON collaborations.note_id = notes.id
      WHERE notes.owner = $1 OR collaborations.user_id = $1
      GROUP BY notes.id`, //? get notes by owner amd colaboration
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel); // ? passing to mapping obj
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username
      FROM notes
      LEFT JOIN users ON users.id = notes.owner
      WHERE notes.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    // ? cek data
    if (!result.rows.length) {
      throw new NotFoundError("Catatan tidak ditemukan");
    }

    // ? passing to mapping obj
    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, body, tags }) {
    const updatedAt = new Date().toISOString();
    const query = {
      // ? $1 is param no from values
      text: "UPDATE notes SET title = $1, body = $2, tags = $3, updated_at = $4 WHERE id = $5 RETURNING id",
      values: [title, body, tags, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
    }
  }

  async deleteNoteById(id) {
    const query = {
      text: "DELETE FROM notes WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId); //? cek note is belong to owner
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(noteId, userId); //? cek id is colaboration note
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesService;
