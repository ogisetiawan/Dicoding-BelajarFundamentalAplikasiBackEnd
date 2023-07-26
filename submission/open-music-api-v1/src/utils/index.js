/* eslint-disable linebreak-style */
/* eslint-disable key-spacing */
/* eslint-disable camelcase */
// eslint-disable-next-line linebreak-style

const mapDBToModel = ({ id, title, year, performer, genre, duration, album_id }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

//? this for result get/album/id version 2
// const mapDBToAlbumSongService = ({ id, name, year }, song) => ({
//   id,
//   name,
//   year,
//   songs: song,
// });
const mapDBToAlbumSongService = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

const mapDBToPlaylistSong = (playlistData, songData) => ({
  playlist: {
    id: playlistData.id,
    name: playlistData.name,
    username: playlistData.username,
    songs: songData,
  },
});

const mapDBToPlalistActivity = (playlistId, activities) => ({
  playlistId,
  activities,
});

module.exports = { mapDBToModel, mapDBToAlbumSongService, mapDBToPlaylistSong, mapDBToPlalistActivity };
