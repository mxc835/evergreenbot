const { EmbedBuilder } = require('discord.js');
const { mentorRoleId, oversightRoleId } = require('../config.json');

module.exports = async (interaction) => {
  const member = await interaction.guild.members.fetch(interaction.user.id);

  if (!member.roles.cache.has(oversightRoleId)) {
    return interaction.reply({
      content: '❌ You do not have permission to view the mentor list.',
      ephemeral: true
    });
  }

  const role = await interaction.guild.roles.fetch(mentorRoleId);
  if (!role || role.members.size === 0) {
    return interaction.reply({ content: 'No mentors are currently assigned.', ephemeral: true });
  }

  const list = role.members.map(m => `• ${m.user.tag}`).join('\n');

  const embed = new EmbedBuilder()
    .setTitle('Evergreen College — Mentor & Host Roster')
    .setDescription(list)
    .setColor(0x2D6A4F)
    .setFooter({ text: 'Scitt Notices • Evergreen College' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
};
