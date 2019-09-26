module.exports = {
    info: {
        name: 'volume',
        aliases: ['vol', 'v', 'صوت'],
        dj: true
    },
    run: (client, message, args) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('You should play something to change it\'s volume.'));
        if (!args[1]) return message.channel.send(client.embeds.message(`The volume is: $${queue.volume}/100`));
        args[1] = parseInt(args[1]);
        if (isNaN(args[1])) return message.channel.send(client.embeds.error('WTF? I accept only numbers.'));
        if (args[1] > 100 || args[1] < 1) return message.channel.send(client.embeds.error(`Please give a number between 1 and 100, not ${args[1]}.`));
        queue.volume = args[1];
        queue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100);
        message.channel.send(client.embeds.success(`The volume now is: ${args[1]}/100`));
    }
};
