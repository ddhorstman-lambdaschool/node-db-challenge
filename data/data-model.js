const knex = require("./dbConfig");

function addProject(project) {
  return knex("projects")
    .insert(project, ["id"])
    .then(([id]) => knex("projects").where({ id }).first());
}
function addTask(task) {
  return knex("tasks")
    .insert(task, ["id"])
    .then(([id]) => knex("tasks").where({ id }).first());
}
function getProjects() {
  return knex("projects").first();
}
function getProject(id) {
  return knex("projects").where({ id }).first();
}
function getTasks(project_id) {
  return knex("tasks")
    .where(project_id ? { project_id } : {})
    .join("projects", "projects.id", "tasks.project_id")
    .select(
      "tasks.description",
      "tasks.notes",
      "tasks.completed",
      "projects.name as project_name",
      "projects.description as project_description"
    );
}
function addResource(resource) {
  return knex("resources")
    .insert(resource)
    .then(([id]) => knex("resources").where({ id }).first());
}
function getResources() {
  return knex("resources");
}
module.exports = {
  addProject,
  addTask,
  getProjects,
  getProject,
  getTasks,
  addResource,
  getResources,
};
