const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('View bot uptime and system status'),
  execute: require('../handlers/status')
};
