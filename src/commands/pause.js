module.exports = {
    info: {
        name: 'pause',
        aliases: [],
        dj: true
    },
    run: (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('Something should be play something to pause.'));
        if (!queue.playing) return message.channel.send(client.embeds.error('The music is already paused.'));
        queue.playing = false;
        queue.connection.dispatcher.pause();
        message.channel.send(client.embeds.success('The music has been paused.'));
    }
};
