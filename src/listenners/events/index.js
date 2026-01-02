import appMentionedCallback from "./app-mentioned.js";

const register = (app) => {
  app.event('app_mention', appMentionedCallback);
};

export default { register };