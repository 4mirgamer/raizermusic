module.exports = {
    name: 'message',
    run: (client, message) => {
        let prefix = client.config.prefix;
        if (!message.guild || message.author.bot || !message.content.startsWith(prefix) || !message.channel.name == client.config.channel) return;
        let args = message.content.slice(prefix.length).split(' ');
        let commandQuery = args[0];
        let command = client.commands[commandQuery];
        if (command) {
            if (command.info.dj && !message.member.hasPermission(client.config.DJRole) && !message.member.hasPermission('ADMINISTRATOR')) return;
            if (message.guild.me.voiceChannel && !message.member.voiceChannel) return message.channel.send(client.embeds.error('You should be in my voice channel.'));
            if (message.guild.me.voiceChannel && !message.guild.me.voiceChannelID == message.member.voiceChannelID) return message.channel.send(client.embeds.error('You should be in my voice channel.'));
            if (!message.member.voiceChannel) return message.channel.send(client.embeds.error('You should be in a voice channel.'));
            command.run(client, message, args);
        }
    }
};
