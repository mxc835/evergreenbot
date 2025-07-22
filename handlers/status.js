const { EmbedBuilder } = require('discord.js');

module.exports = async (interaction) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const mins = Math.floor((uptime % 3600) / 60);
  const secs = Math.floor(uptime % 60);

  const embed = new EmbedBuilder()
    .setTitle('EvergreenBot Status')
    .addFields(
      { name: ' Uptime', value: `${hours}h ${mins}m ${secs}s`, inline: true },
      { name: ' Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
      { name: ' External Monitor', value: '[View BetterStack Status](https://betterstack.com/team/YOUR_TEAM_SLUG/status-page/YOUR_PAGE_SLUG)' }
    )
    .setColor(0x2D6A4F)
    .setFooter({ text: 'Evergreen College • System Status' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
};
