const { EmbedBuilder } = require('discord.js');
const { roleId } = require('../config.json');

module.exports = async (interaction, client) => {
  const id = interaction.options.getString('id');
  const training = client.trainings?.get(id);

  if (!training) {
    return interaction.reply({
      content: `❌ No training found with ID: \`${id}\``,
      ephemeral: true
    });
  }

  const embed = new EmbedBuilder()
    .setTitle('Evergreen College — SCITT Training Commenced')
    .addFields(
      { name: 'Host', value: training.host, inline: true },
      { name: 'Time', value: training.time, inline: true },
      { name: 'Department', value: training.department, inline: true }
    )
    .setDescription('The SCITT training has now commenced. Please may all the staff in the department join the voice chat')
    .setColor(0x2D6A4F)
    .setFooter({ text: 'SCITT Notices • Evergreen College' });

  const channel = client.channels.cache.get(interaction.guild.channels.cache.get(interaction.channelId).id);
  await channel.send({ content: `<@&${roleId}>`, embeds: [embed] });

  await interaction.reply(`Training session for department **${training.department}** has commenced.`);
};
