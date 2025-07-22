const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('checkstrikes')
    .setDescription('View a user’s strike history')
    .addUserOption(opt =>
      opt.setName('player').setDescription('User to check').setRequired(true)
    ),
  execute: require('../handlers/checkstrikes')
};
