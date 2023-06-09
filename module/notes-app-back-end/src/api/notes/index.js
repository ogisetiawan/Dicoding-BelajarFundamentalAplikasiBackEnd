// @ register plugin (function)
const NotesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'notes',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const notesHandler = new NotesHandler(service, validator); //? call handler and pass service to _construct
    server.route(routes(notesHandler)); //? call routes and pass handler
  },    
};