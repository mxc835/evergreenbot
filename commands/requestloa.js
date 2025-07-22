const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('requestloa')
    .setDescription('Submit a leave of absence request')
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for LOA').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('start_date').setDescription('Start date (e.g. 22/07)').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('end_date').setDescription('End date (e.g. 29/07)').setRequired(true)
    ),
  execute: require('../handlers/requestloa')
};
