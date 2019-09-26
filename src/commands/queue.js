const { RichEmbed } = require('discord.js');
const switchPage = () => {
    num = 0;
    embed.setDescription(queue.songs.slice(1).map((song) => {
        return `${++num}) **${song.title.length > 60 ? song.title.slice(0, parseInt("-" + `${song.title.length - (song.title.length - 60)}`)) + "..." : song.title}**`;
    }).slice((currentPage*10)-10, currentPage*10).join('\n'));
    msg.edit(embed);
}
module.exports = {
    info: {
        name: 'queue',
        aliases: ['q', 'qu', 'قائمة', 'القائمة'],
        dj: false
    },
    run: async (client, message) => {
        let queue = client.queue[message.guild.id];
        if (!queue) return message.channel.send(client.embeds.error('There\'s no queue to show.'));
        if (queue.songs.length == 1) return;
        let num = 0;
        let embed = new RichEmbed()
        .setAuthor('Songs queue.', message.guild.iconURL)
        .setDescription(queue.songs.slice(1).map((song) => `${++num}) **${song.title.length > 60 ? song.title.slice(0, parseInt("-" + `${song.title.length - (song.title.length - 60)}`)) + "..." : song.title}**`).slice(0, 10).join('\n'))
        .addField('Now playing', queue.songs[0].title)
        .setFooter('Built with ❤ by Rayzer 乡')
        .setColor('#36393E')
        .setThumbnail(message.author.displayAvatarURL);
        let msg = await message.channel.send(embed);
        if (queue.songs.slice(1).length > 10) {
            await msg.react('⬅');
            await msg.react('➡');
            let currentPage = 1;
            let pages = queue.songs.slice(1).length / 10;
            if (!Number.isInteger(pages)) pages = parseInt(pages) + 1;
            let LeftCollector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '⬅' && user.id == message.author.id, {
                time: 100000
            });
            let rightCollector = msg.createReactionCollector((reaction, user) => reaction.emoji.name === '➡' && user.id == message.author.id, {
                time: 100000
            });
            LeftCollector.on('collect', async () => {
                if (currentPage == 1) return;
                currentPage-=1;
                switchPage();
            });
            rightCollector.on('collect', async () => {
                if (currentPage == pages) return;
                currentPage+=1;
                switchPage();
            });
        }
    }
};
