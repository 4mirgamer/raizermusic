module.exports = {
    info: {
        name: 'resume',
        aliases: [],
        dj: true
    },
    run: (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue || queue.playing) return message.channel.send(client.embeds.error('Something should be paused to resume.'));
        queue.playing = true;
        queue.connection.dispatcher.resume();
        message.channel.send(client.embeds.success('The music has been resumed.'));
    }
};
