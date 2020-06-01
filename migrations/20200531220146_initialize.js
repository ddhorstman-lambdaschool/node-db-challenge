exports.up = function (knex) {
  return knex.schema
    .createTable("resources", tbl => {
      tbl.increments("id");
      tbl.string("name").notNullable();
      tbl.string("description");
    })
    .createTable("projects", tbl => {
      tbl.increments("id");
      tbl.boolean("completed");
      tbl.string("name").notNullable();
      tbl.string("description");
    })
    .createTable("tasks", tbl => {
      tbl.increments("id");
      tbl.boolean("completed");
      tbl
        .integer("project_id")
        .notNullable()
        .unsigned()
        .references("projects.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.string("description").notNullable();
      tbl.string("notes");
    })
    .createTable("project_resources", tbl => {
      tbl
        .integer("resource_id")
        .notNullable()
        .unsigned()
        .references("resources.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("project_id")
        .notNullable()
        .unsigned()
        .references("projects.id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.primary(["resource_id", "project_id"]);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("project_resources")
    .dropTableIfExists("tasks")
    .dropTableIfExists("projects")
    .dropTableIfExists("resources");
};
