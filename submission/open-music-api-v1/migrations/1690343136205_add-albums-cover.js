/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.addColumns('albums', {
        cover: {
            type: 'TEXT',
        },
    });
};
