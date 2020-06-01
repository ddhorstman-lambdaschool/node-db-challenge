exports.seed = function (knex) {
    // Inserts seed entries
    return knex("resources").insert([
      { name: "Computer" },
      { name: "Conference Room" },
      { name: "Microphone" },
      { name: "Big-ass Van" },
    ]);
};
