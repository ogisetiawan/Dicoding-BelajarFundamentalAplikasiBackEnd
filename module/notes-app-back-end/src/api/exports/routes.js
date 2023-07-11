const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes', //? init export data notes
    handler: handler.postExportNotesHandler,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];
 
module.exports = routes;