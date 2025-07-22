const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

// Replace with your staff channel ID
const reviewChannelId = '1397121632828391464';

module.exports = async (interaction) => {
  const reason = interaction.options.getString('reason');
  const start = interaction.options.getString('start_date');
  const end = interaction.options.getString('end_date');
  const requester = interaction.user;

  const embed = new EmbedBuilder()
    .setTitle(' LOA Request')
    .setDescription(`New leave request submitted by ${requester.tag}`)
    .addFields(
      { name: 'Reason', value: reason },
      { name: 'Start Date', value: start, inline: true },
      { name: 'End Date', value: end, inline: true }
    )
    .setFooter({ text: `User ID: ${requester.id}` })
    .setColor(0x2D6A4F);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`loa_accept_${requester.id}`)
      .setLabel(' Accept')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`loa_reject_${requester.id}`)
      .setLabel(' Reject')
      .setStyle(ButtonStyle.Danger)
  );

  // Post to staff channel
  await interaction.client.channels.cache.get(reviewChannelId).send({
    embeds: [embed],
    components: [row]
  });

  await interaction.reply({
    content: ' Your LOA request has been sent for review.',
    ephemeral: true
  });
};
