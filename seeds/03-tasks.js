exports.seed = function (knex) {
  // Inserts seed entries
  return knex("tasks").insert([
    { project_id: 1, description: "Casting call for talent" },
    { project_id: 1, description: "Fire cameraman and hire someone better" },
    { project_id: 2, description: "Procrastinate for three weeks" },
    { project_id: 2, description: "Watch Angel complete series" },
    { project_id: 2, description: "Cram at the last minute" },
    { project_id: 3, description: "Make very fancy posterboard" },
    { project_id: 3, description: "Do sound check before the meeting" },
    { project_id: 3, description: "Do sound check before the meeting" },
    { project_id: 2, description: "Ssh, don't tell anyone about the plan" },
  ]);
};
