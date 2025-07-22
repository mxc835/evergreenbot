const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId, hostRoleId } = require('./config.json');

// Fetch host members from role dynamically
const fetchHostChoices = async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

  return new Promise((resolve, reject) => {
    client.once('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId);
        await guild.members.fetch(); // Cache all members

        const role = await guild.roles.fetch(hostRoleId);
        if (!role) throw new Error('Host role not found');

        const choices = role.members.map(member => ({
          name: member.user.username.slice(0, 100), // Discord max name length is 100
          value: member.user.username
        })).slice(0, 25); // Discord allows up to 25 choices

        await client.destroy();
        resolve(choices);
      } catch (error) {
        reject(error);
      }
    });

    client.login(token);
  });
};

(async () => {
  try {
    const hostChoices = await fetchHostChoices();

    // Load commands from /commands
    const commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);

      // Inject dynamic choices into scheduletraining
      if (file === 'scheduletraining.js') {
        const hostOption = command.data.options.find(opt => opt.name === 'host');
        if (hostOption) hostOption.choices = hostChoices;
      }

      commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);
    console.log('🚀 Deploying updated slash commands...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('✅ All commands deployed successfully with dynamic host options!');
  } catch (err) {
    console.error('❌ Failed to deploy commands:', err);
  }
})();
