import appMentionedCallback from "./app-mentioned";

const register = (app) => {
  app.command('app_mention', appMentionedCallback);
};

export default { register };