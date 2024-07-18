const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const cron = require('cron');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
  new SlashCommandBuilder()
    .setName('rena_info')
    .setDescription('Erhalte allgemeine Informationen über Rena'),
  new SlashCommandBuilder()
    .setName('rena_personal')
    .setDescription('Erhalte persönliche Informationen über Rena'),
  new SlashCommandBuilder()
    .setName('rena_pascal_affaere')
    .setDescription('Erhalte Informationen über die Affäre von Rena mit Pascal'),
  new SlashCommandBuilder()
    .setName('bildergalerie')
    .setDescription('Zeige eine Bildergalerie von Rena'),
  new SlashCommandBuilder()
    .setName('zitat_des_tages')
    .setDescription('Erhalte ein zufälliges Zitat von Rena'),
  new SlashCommandBuilder()
    .setName('hintergrundgeschichte')
    .setDescription('Erfahre mehr über Renas Hintergrundgeschichte'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.once('ready', () => {
  console.log('Ready!');
  
  const channel = client.channels.cache.find(ch => ch.name === 'chat');
  if (!channel) {
    console.error('Channel "chat" not found!');
    return;
  }

  const factJob = new cron.CronJob('0 0 * * *', () => {
    const facts = [
      'Rena mag Magensäure. Es ist verstörend, aber sie liebt es. Sie wünscht sich, jemand würde sie auffressen. Krank, oder?',
      'Rena war schon mit einem 10 Jährigen zusammen sie streitet es aber bis heute ab obwohl es eindeutige Beweise gibt.',
      'Rena verfügt über mehrere Persönlichkeiten. Ihre Persönlichkeiten wechseln sich je nach aktueller Lage und wie sie sich fühlt.'
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];

    channel.send(fact);
  });

  factJob.start();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'rena_info') {
    const embed = new EmbedBuilder()
      .setTitle('Allgemeine Informationen über Rena')
      .setDescription('Hier sind einige allgemeine Informationen über Rena.')
      .addFields(
        { name: 'Name', value: 'Joé Krbec' },
        { name: 'Alter', value: '19' },
        { name: 'Beruf', value: 'Arbeitslos' },
        { name: 'Herkunft', value: 'Luxemburg' }
      )
      .setColor(0x00FF00)
      .setFooter({ text: 'Allgemeine Informationen' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'rena_personal') {
    const embed = new EmbedBuilder()
      .setTitle('Persönliche Informationen über Rena')
      .setDescription('Hier sind einige persönliche Informationen über Rena.')
      .addFields(
        { name: 'Beziehung', value: 'In einer Beziehung mit Pascal, 10 Jahre.' },
        { name: 'Wohnort', value: '4 Rue Mercier L-2144 Luxembourg' },
        { name: 'Hobbies', value: 'Kinder anlocken, sich selber essen.' },
        { name: 'Geburtsdatum', value: '23. November 2004' },
        { name: 'Lieblingsfarbe', value: 'Pink' },
        { name: 'Lieblingsessen', value: 'Menschenfleisch' }
      )
      .setColor(0xFF0000)
      .setFooter({ text: 'Persönliche Informationen' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'rena_pascal_affaere') {
    const embed = new EmbedBuilder()
      .setTitle('Rena Pascal Affäre')
      .setDescription('Die Affäre von Rena mit Pascal.')
      .addFields(
        { name: 'Tat', value: 'Ende 2022 wurden im Internet plötzlich Screenshots von Chats veröffentlicht, die Konversationen zwischen Rena und einem zehnjährigen Jungen, Pascal zeigten. Die Konversationen waren nicht von belanglosen Themen geprägt, sondern offenbar von einer Beziehung. Rena bat Pascal, Bilder von seinen Zähnen zu schicken, was in diesem Kontext ungewöhnlich erscheint. Graf war zu diesem Zeitpunkt 17 Jahre alt, weshalb die Tat als pädophil eingestuft werden könnte. Rena bestreitet jedoch bis heute jegliche Beteiligung und sagt, die Screenshots seien gefälscht, was jedoch nicht stimmt.' },
      )
      .setColor(0x0000FF)
      .setFooter({ text: 'Rena Pascal Affäre' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'bildergalerie') {
    const images = [
      'https://files.catbox.moe/07nn06.png',
      'https://files.catbox.moe/dki5j4.png',
      'https://files.catbox.moe/f8u41o.png',
      'https://files.catbox.moe/2j1ebw.png',
      'https://files.catbox.moe/zh3sl0.png'
    ];
    const image = images[Math.floor(Math.random() * images.length)];

    const embed = new EmbedBuilder()
      .setTitle('Bildergalerie von Rena')
      .setImage(image)
      .setColor(0x00FFFF)
      .setFooter({ text: 'Bildergalerie' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'zitat_des_tages') {
    const quotes = [
      '"Ich würde alles dafür geben, gegessen zu werden! Einfach weiterzuleben ist doch viel zu langweilig!"',
      '"Ich bin immer auf der Suche nach neuen, aufregenden Beziehungen. Egal, ob derjenige 18 oder 10 Jahre Alt ist – ich bin für alles offen!',
      '"Ich habe so viele verschiedene Persönlichkeiten, und bald schon werde ich wieder meine Persönlichkeit wechseln – ich kann es kaum erwarten! Hallo, ihr Lieben! Hier ist Victor!"'
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    const embed = new EmbedBuilder()
      .setTitle('Zitat des Tages')
      .setDescription(quote)
      .setColor(0xFFA500)
      .setFooter({ text: 'Zitat des Tages' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } else if (commandName === 'hintergrundgeschichte') {
    const embed = new EmbedBuilder()
      .setTitle('Hintergrundgeschichte von Rena')
      .setDescription('Hier ist die Hintergrundgeschichte von Rena.')
      .addFields(
        { name: 'Frühes Leben', value: 'Rena wurde am 23.11.2004 in Luxemburg geboren. Schon als Junge führte sie ein Leben in einem strengen Elternhaus. Sie interessierte sich von jeher für den Sinn des Lebens. Warum leben wir? Wozu? Diese Fragen beschäftigten Rena, die damals noch Joé hieß, intensiv. Dies führte dazu, dass sie auch über sich selbst und ihre Identität nachdachte. Sie begann, sich zu fragen, ob sie wirklich ein Junge sein sollte oder eher ein Mädchen. Eines stand zu diesem Zeitpunkt bereits fest: Sie würde ihr Geschlecht ändern.' },
        { name: 'Werdegang', value: 'Joé lebt sein Leben und besucht zeitweise das Internat "Liewenshaff". Dort lernt er, wie soziales Verhalten richtig funktioniert. Es ist der Versuch, das nachzuholen, was er bei sich zu Hause von seinen Eltern nicht erlebt hat. Inzwischen hat sich Joé online als Rena bekannt gemacht und ist nun offiziell eine Frau. Es stört sie nicht, dies öffentlich zu sagen, auch wenn sie dafür von einigen diskriminiert wird. Ihre Persönlichkeit entwickelt sich in Rekordtempo, und sie wird zum Superstar.' },
        { name: 'Aktuelles Leben', value: 'Heute lebt Rena in einer großen Burg in Luxemburg. Sie ist finanziell abgesichert und muss sich nie wieder Gedanken um Geld machen. Mit ihrem Server "NeverGame" ist es einfacher als je zuvor, neue Opfer zu gewinnen, da die Spielerschaft im Alter von 10 bis 14 Jahren besonders stark vertreten ist.' }
      )
      .setColor(0x800080)
      .setFooter({ text: 'Hintergrundgeschichte' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
});

client.login(config.token);