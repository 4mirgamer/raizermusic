const shuffle = (arr) => {
    var currentIndex = arr.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr
}
module.exports = {
    info: {
        name: 'shuffle',
        aliases: [],
        dj: true
    },
    run: (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('You should play something to shiffle it\'s queue.'));
        if (queue.songs == 1) return message.channel.send(client.embeds.error('There\'s only one song in the queue. There should be three songs at least.'));
        if (queue.songs == 2) return message.channel.send(client.embeds.error('There\'s only two songs in the queue. There should be three songs at least.'));
        let shuffledQueue = shuffle(queue.songs.slice(1));
        shuffledQueue.unshift(queue.songs[0]);
        queue.songs = shuffledQueue;
        message.channel.send(client.embeds.success('The queue has been shuffled.'));
    }
};
