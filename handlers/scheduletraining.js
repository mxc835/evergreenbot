const { EmbedBuilder } = require('discord.js');
const { roleId } = require('../config.json');

// Replace this with your target channel ID for SCITT notifications
const targetChannelId = 'YOUR_SCITT_NOTICES_CHANNEL_ID';

module.exports = async (interaction, client) => {
  const host = interaction.options.getString('host');
  const time = interaction.options.getString('time');
  const department = interaction.options.getString('department');
  const voiceChannel = interaction.options.getChannel('voice_channel');
  const id = Math.random().toString(36).substr(2, 9);

  if (!client.trainings) client.trainings = new Map();
  client.trainings.set(id, { host, time, department, voiceChannel });

  const embed = new EmbedBuilder()
    .setTitle('Evergreen College — SCITT Training Scheduled')
    .addFields(
      { name: 'Host', value: host, inline: true },
      { name: 'Time', value: time, inline: true },
      { name: 'Department', value: department, inline: true },
      { name: 'Voice Channel', value: `<#${voiceChannel.id}>` }
    )
    .setDescription(
      `A SCITT training has been scheduled for ${department}. When the time comes, all relevant staff should join <#${voiceChannel.id}>.`
    )
    .setColor(0x2D6A4F)
    .setFooter({ text: 'SCITT Notices • Evergreen College' });

  const channel = client.channels.cache.get(targetChannelId);
  if (channel) {
    await channel.send({ content: `<@&${roleId}>`, embeds: [embed] });
  } else {
    console.warn('Target channel not found.');
  }

  await interaction.reply({
    content: `Training scheduled successfully in ${voiceChannel.name}. Notification sent to staff.`,
    ephemeral: true
  });

  try {
    await interaction.user.send(
      `Training scheduled.\nReference ID: ${id}\nBe present in ${voiceChannel.name} at ${time}.`
    );
  } catch {
    console.warn(`Could not DM ${interaction.user.tag}`);
  }
};
