module.exports = {
    info: {
        name: 'stop',
        aliases: ['stp', 'st', 'وقف'],
        dj: true
    },
    run: (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('You should play something to stop.'));
        queue.songs = [];
        queue.connection.dispatcher.end();
        message.channel.send(client.embeds.success('The music has been stopped.'));
    }
};
