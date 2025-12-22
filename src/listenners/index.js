import commands from './commands'
import events from './events';

const registerListeners = (app) => {
  commands.register(app);
  events.register(app)
};

export default registerListeners;