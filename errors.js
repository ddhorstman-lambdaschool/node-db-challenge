const { ValidationError, Validator } = require("jsonschema");
const knex = require("./data/dbConfig");

class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function custom404(req, res, next) {
  next(
    new AppError(
      `${req.method} on ${req.originalUrl} is not a valid request.`,
      404
    )
  );
}

function errorHandling(error, req, res, next) {
  console.error(error);
  //handle ValidationErrors, which are sent as an array
  if (error[0] instanceof ValidationError) {
    const message = error.map(e => e.stack.replace(/"/g, "'"));
    return res.status(400).json({ message });
  }
  //handle ordinary errors
  else {
    const { status = 500, message = "Error" } = error;
    return res.status(status).json({ message });
  }
}

function validate(name) {
  function processSchema(rawSchema) {
    const keep = ["type", "maxLength"];

    let properties = {};
    let required = [];

    for (const colName in rawSchema) {
      if (!rawSchema[colName].nullable && !colName.includes("id")) {
        required.push(colName);
      }

      properties[colName] = keep.reduce((constraints, constraintName) => {
        constraints[constraintName] = rawSchema[colName][constraintName];
        return constraints;
      }, {});
    }

    return {
      type: "object",
      properties,
      additionalProperties: false,
      required,
    };
  }
  return catchAsync(async (req, res, next) => {
    const rawSchema = await knex(name).columnInfo();
    console.log(processSchema(rawSchema))
    const v = new Validator();
    const { errors } = v.validate(req.body, processSchema(rawSchema));
    errors.length !== 0 ? next(errors) : next();
  });
}

module.exports = { AppError, catchAsync, custom404, errorHandling, validate };
