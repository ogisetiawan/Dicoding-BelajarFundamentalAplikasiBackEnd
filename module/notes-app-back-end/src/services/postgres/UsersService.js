const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt"); //? hasing pw
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username); //? checkUser

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10); //? saltRounds 10

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id", //? return id_user
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query); //? exec query

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }
    return result.rows[0].id; //? return user_id
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query); //? check if row == 0 (username)

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0]; //? tampung ke variable hashedpass
    const match = await bcrypt.compare(password, hashedPassword); //? cek password and hashed password

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return id;
  }
}

module.exports = UsersService;
