exports.seed = function (knex) {
    // Inserts seed entries
  return knex("projects").insert([
    {name: "TV Commercial"},
    {name: "Research Paper"},
    {name: "Big Client Presentation"},
    {name: "Super Secret Meeting"}
  ])
};
