const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('starttraining')
    .setDescription('Start a scheduled staff training session')
    .addStringOption(option =>
      option.setName('id')
        .setDescription('Training ID issued when scheduled')
        .setRequired(true)
    ),
  execute: require('../handlers/starttraining')
};
