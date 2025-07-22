const supabase = require('../db/supabaseClient');
const { EmbedBuilder } = require('discord.js');

// 🔒 Only staff with this role ID can use the command
const oversightRoleId = '1397121630987223099'; // Replace with real role ID

module.exports = async (interaction) => {
  if (!interaction.member.roles.cache.has(oversightRoleId)) {
    return await interaction.reply({
      content: '🚫 You don’t have permission to check strikes.',
      ephemeral: true
    });
  }

  const target = interaction.options.getUser('player');

  const { data, error } = await supabase
    .from('strikes')
    .select('*')
    .eq('user_id', target.id)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error(error);
    return await interaction.reply({
      content: ' There was an error fetching strike data.',
      ephemeral: true
    });
  }

  const embed = new EmbedBuilder()
    .setTitle(` Strike Record: ${target.tag}`)
    .setColor(data.length === 0 ? 0x2D6A4F : 0xFF6B6B)
    .setDescription(
      data.length === 0
        ? ' This user has no recorded strikes.'
        : data
            .slice(0, 5)
            .map(
              (strike, i) =>
                `**#${i + 1}** • ${strike.reason}\n*Issued by:* ${strike.issued_by} on ${new Date(strike.timestamp).toLocaleDateString()}`
            )
            .join('\n\n')
    )
    .setFooter({ text: `Total Strikes: ${data.length}` });

  await interaction.reply({ embeds: [embed], ephemeral: true });
};
