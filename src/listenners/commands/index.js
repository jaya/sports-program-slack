import listActivitiesCallback from "./activities-commands";

const register = (app) => {
  app.command('/list-activities', listActivitiesCallback);
};

export default { register };