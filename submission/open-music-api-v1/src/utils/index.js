const mapDBToModel = ({
  id, title, year, performer, genre, duration, albumID,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: albumID,
});

const mapDBToAlbumSongService = ({
  id, name, year, cover,
}, song) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs: song,
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

module.exports = {
  mapDBToModel, mapDBToAlbumSongService, mapDBToPlaylistSong, mapDBToPlalistActivity,
};
