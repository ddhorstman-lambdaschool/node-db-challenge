const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;
const { Validator } = require("jsonschema");
const { custom404, errorHandling, catchAsync, AppError } = require("./errors");

const db = require("./data/data-model");
server.use(express.json());
const validateID = catchAsync(validateProjectID);
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
  "/api/projects/:id",
  validateProjectID,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await db.getProject(id);
    res.status(200).json(project);
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
  validateID,
  catchAsync(async (req, res) => {
    const { id } = req.project;
    const tasks = await db.getTasks(id);
    res.status(200).json(tasks);
  })
);

/*----------------------------------------------------------------------------*/
/* POST Requests
/*----------------------------------------------------------------------------*/
server.post(
  "/api/projects",
  validate("projectSchema"),
  catchAsync(async (req, res) => {
    const project = await db.add("projects")(req.body);
    res.status(200).json(project);
  })
);
server.post(
  "/api/resources",
  validate("resourceSchema"),
  catchAsync(async (req, res) => {
    const resource = await db.add("resources")(req.body);
    res.status(200).json(resource);
  })
);

server.post(
  "/api/projects/:id/tasks",
  validateProjectID,
  validate("taskSchema"),
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const task = await db.add("tasks")({ ...req.body, project_id: id });
    res.status(200).json(task);
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
  const project = await db.getProject(id);
  req.project = project;
  project ? next() : next(new AppError(`${id} is not a valid project ID`, 404));
}

function validate(schema) {
  const schemas = {
    projectSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        completed: { type: "boolean" },
      },
      additionalProperties: false,
      required: ["name"],
    },

    resourceSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
      },
      additionalProperties: false,
      required: ["name"],
    },

    taskSchema: {
      type: "object",
      properties: {
        description: { type: "string" },
        notes: { type: "string" },
        completed: { type: "boolean" },
      },
      additionalProperties: false,
      required: ["description"],
    },
  };
  return function (req, res, next) {
    const v = new Validator();
    const { errors } = v.validate(req.body, schemas[schema]);
    errors.length !== 0 ? next(errors) : next();
  };
}
