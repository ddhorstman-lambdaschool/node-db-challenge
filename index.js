const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;
const { custom404, errorHandling, catchAsync, AppError } = require("./errors");

const db = require("./data/data-model");
const validateProjID = catchAsync(validateProjectID);
/*----------------------------------------------------------------------------*/
/* GET
/*----------------------------------------------------------------------------*/
server.get(
  "/api/projects",
  catchAsync(async (req, res) => {
    const projects = await db.getProjects();
    res.status(200).json(projects);
  })
);
server.get(
  "/api/resources",
  catchAsync(async (req, res) => {
    const resources = await db.getResources();
    res.status(200).json(resources);
  })
);
server.get(
  "/api/tasks",
  catchAsync(async (req, res) => {
    const tasks = await db.getTasks();
    res.status(200).json(tasks);
  })
);
server.get(
  "/api/:id/tasks",
  validateProjID,
  catchAsync(async (req, res) => {
    const { id } = req.project;
    const tasks = await db.getTasks(id);
    res.status(200).json(tasks);
  })
);

/*----------------------------------------------------------------------------*/
/* Errors and Listen
/*----------------------------------------------------------------------------*/

server.all("*", custom404);
server.use(errorHandling);

server.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*----------------------------------------------------------------------------*/
/* Middleware
/*----------------------------------------------------------------------------*/
async function validateProjectID(req, res, next) {
  const { id } = req.params;
  //projects are returned as an array - we just want the first entry
  const [project] = await db.getProject(id);
  req.project = project;
  project ? next() : next(new AppError(`${id} is not a valid project ID`, 404));
}
