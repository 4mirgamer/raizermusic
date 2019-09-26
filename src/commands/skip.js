module.exports = {
    info: {
        name: 'skip',
        aliases: ['s', 'skp', 'تخطي', 'تخطى'],
        dj: true
    },
    run: (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('You should play something to skip.'));
        queue.connection.dispatcher.end();
    }
};
