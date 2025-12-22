import commands from './commands'

const registerListeners = (app) => {
  commands.register(app);
};

export default registerListeners;