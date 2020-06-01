const knex = require("./dbConfig");

function addProject() {}
function addTask(project_id) {}
function getProjects() {
  return knex("projects");
}
function getProject(id) {
  return knex("projects").where({ id });
}
function getTasks(project_id) {
  return knex("tasks")
    .where(project_id ? { project_id } : {})
    .join("projects", "projects.id", "tasks.id")
    .select(
      "tasks.description",
      "tasks.notes",
      "tasks.completed",
      "projects.name as project_name",
      "projects.description as project_description"
    );
}
function addResource() {}
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
