const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mentorlist")
    .setDescription(
      "Display the current mentor roster (restricted to SCITT Oversight role)",
    ),
  execute: require("../handlers/mentorlist"),
};
