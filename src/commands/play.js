const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube('AIzaSyCQapWI28_Um0n4AEGNVw7l3QZqhQF0cFs');
const addVideo = async (video, message, voiceChannel, playlist) => {
    if (!video || !video.id) return;
    let queue = message.client.queue[message.guild.id]; 
    let song = {
        id: video.id,
        title: video.title,
        url: `https://www.youtube.com/watch?v=${video.id}`
    }
    if (!queue) {
        message.client.queue[message.guild.id] = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            playing: true
        }
        queue = message.client.queue[message.guild.id];
        queue.songs.push(song);
        let connection = await voiceChannel.join();
        queue.connection = connection;
        play(message.guild, queue.songs[0], true);
        return;
    }
    queue.songs.push(song);
    if (playlist) return;
    message.channel.send(message.client.embeds.success(`${song.title} has been added to the queue.`));
};
const play = (guild, song, first=false) => {
    let queue = guild.client.queue[guild.id];

    if (!song) {
        queue.voiceChannel.leave();
        guild.client.queue[guild.id] = undefined;
        return;
    }
    let dispatcher = queue.connection.playStream(ytdl(song.url));
    dispatcher.on('end', () => {
        queue.songs.shift();
        play(guild, queue.songs[0]);
    });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    if (first) {
        queue.textChannel.send(guild.client.embeds.success(`Now playing ${song.title}`));
    }
};
module.exports = {
    info: {
        name: 'play',
        aliases: ['ply', 'p', 'شغل', 'تشغيل'],
        dj: false
    },
    run: async (client, message, args) => {
        let voiceChannel = message.member.voiceChannel;
        let url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
        if (message.guild.afkChannel.id == voiceChannel.id) return message.channel.send(client.embeds.error('This is the AFK channel. Don\'t be noisy :)'));
        if (!args[1]) return message.channel.send(client.embeds.error('Please type the song name.'))
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            let playlist = await youtube.getPlaylist(url),
            videos = await playlist.getVideos();
            for (let video of Object.values(videos)) {
                video = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await addVideo(video, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }
        } else {
            let video;
            try {
                video = await youtube.getVideo(url);
            } catch (error) {
                let videos = await youtube.searchVideos(args.slice(1).join(' '), 1);
                video = videos[0];
            }
            if (!video) return message.channel.send(client.embeds.error(' I can\'t find what are you looking for.'));
            return addVideo(video, message, voiceChannel, false);
        }
    }
};
