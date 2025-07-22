const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scheduletraining')
    .setDescription('Schedule a staff training')
    .addStringOption(option =>
      option.setName('host')
        .setDescription('Choose the host')
        .setRequired(true)
        .addChoices(
          { name: 'Mr. Harper', value: 'Mr. Harper' },
          { name: 'Ms. Zhang', value: 'Ms. Zhang' }
        )
    )
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Training time')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('department')
        .setDescription('Select department')
        .setRequired(true)
        .addChoices(
          { name: 'Behaviour', value: 'Behaviour' },
          { name: 'Safeguarding', value: 'Safeguarding' },
          { name: 'Teaching & Learning', value: 'Teaching & Learning' },
          { name: 'SEND', value: 'SEND' },
          { name: 'Leadership', value: 'Leadership' }
        )
    )
    .addChannelOption(option =>
      option.setName('voice_channel')
        .setDescription('Select the voice channel for the training')
        .setRequired(true)
    ),
  execute: require('../handlers/scheduletraining')
};
