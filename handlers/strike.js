const supabase = require('../db/supabaseClient');
const { EmbedBuilder } = require('discord.js');

// 🔒 Role restriction — only users with this role can strike
const oversightRoleId = '1397121630987223099'; // Replace with your actual role ID

module.exports = async (interaction) => {
  // Permission check
  if (!interaction.member.roles.cache.has(oversightRoleId)) {
    return await interaction.reply({
      content: ' You don’t have permission to issue strikes.',
      ephemeral: true
    });
  }

  const target = interaction.options.getUser('player');
  const reason = interaction.options.getString('reason');
  const issuer = interaction.user;

  // 🔔 Send strike DM with embed
  try {
    const dmEmbed = new EmbedBuilder()
      .setTitle('🚨 Evergreen College Strike Notice')
      .setDescription('You have received an official strike.')
      .addFields(
        { name: 'Reason', value: reason },
        { name: 'Issued by', value: issuer.tag }
      )
      .setColor(0xFF0000)
      .setFooter({ text: 'This action was recorded in the Evergreen College system.' })
      .setTimestamp();

    await target.send({ embeds: [dmEmbed] });
  } catch {
    console.warn(`Could not DM ${target.tag}`);
  }

  // 🗂 Log strike to Supabase
  await supabase.from('strikes').insert([
    {
      user_id: target.id,
      username: target.tag,
      reason,
      issued_by: issuer.tag,
      timestamp: new Date().toISOString()
    }
  ]);

  // ✅ Confirm back to moderator
  const replyEmbed = new EmbedBuilder()
    .setTitle('Strike Logged')
    .addFields(
      { name: 'User', value: target.tag },
      { name: 'Reason', value: reason },
      { name: 'Issued by', value: issuer.tag }
    )
    .setColor(0xD00000)
    .setFooter({ text: 'Evergreen College • Strike System' });

  await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
};
