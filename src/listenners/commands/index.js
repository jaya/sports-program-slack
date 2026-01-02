import listActivitiesCallback from "./activities-commands.js";
import { listProgramsCallback, createProgramCallback } from "./programs-commands.js";
import { createUserCallback } from "./users-commands.js";


const register = (app) => {
  app.command('/list-activities', listActivitiesCallback);
  app.command('/list-programs', listProgramsCallback);
  app.command('/create-program', createProgramCallback);
  app.command('/signup', createUserCallback);
};

export default { register };