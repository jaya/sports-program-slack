import commands from './commands/index.js'
import events from './events/index.js';

const registerListeners = (app) => {
  commands.register(app);
  events.register(app);
};

export default registerListeners;