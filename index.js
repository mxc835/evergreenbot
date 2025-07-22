const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load bot config and Supabase
const config = require('./config.json');
const supabase = require('./db/supabaseClient');

// Keep-alive server
require('./server');

// Create Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.commands = new Collection();

// Load all commands from /commands folder
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Handle interactions
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: ' Error running command.', ephemeral: true });
    }
  }

  // Handle LOA buttons
  if (interaction.isButton()) {
    const [type, action, userId] = interaction.customId.split('_');
    if (type !== 'loa') return;

    const targetUser = await client.users.fetch(userId);
    const message = action === 'accept'
      ? ' Your LOA request has been accepted.'
      : ' Your LOA request has been rejected. Please contact Oversight for more info.';

    try {
      await targetUser.send(message);
    } catch {
      console.warn(`Could not DM ${targetUser.tag}`);
    }

    await interaction.update({
      content: `LOA ${action === 'accept'  'accepted ' : 'rejected '} by ${interaction.user.tag}`,
      components: [],
      embeds: []
    });
  }
});

// Log in
client.once(Events.ClientReady, () => {
  console.log(` Logged in as ${client.user.tag}`);
});

client.login(config.token);
