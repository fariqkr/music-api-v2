/* eslint-disable camelcase */

exports.shorthands = undefined;


exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlists_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'playlists (id)',
        onDelete: 'CASCADE',
    },
    songs_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'songs (id)',
        onDelete: 'CASCADE',      
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlists_songs');
};

