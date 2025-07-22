const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('strike')
    .setDescription('Issue a strike to a user and log it')
    .addUserOption(option =>
      option.setName('player')
        .setDescription('User to strike')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the strike')
        .setRequired(true)
    ),
  execute: require('../handlers/strike')
};
