const { Client, RichEmbed } = require('discord.js');
const fs = require('fs');
const colors = require('colors');
const config = require('./config.json');
const client = new Client();
client.login(config.token).then(() => {
    console.log(colors.green('Ready.'));
    client.config = config;
    client.commands = {};
    client.queue = {};
    client.embeds = {
        error: (errorString) => {
            return new RichEmbed().setColor('RED').setAuthor(errorString + ' ❌', client.guilds.first().iconURL).setFooter('Built with ❤ by Rayzer 乡');
        },
        success: (successString) => {
            return new RichEmbed().setColor('GREEN').setAuthor(successString + ' ✅', client.guilds.first().iconURL).setFooter('Built with ❤ by Rayzer 乡');
        },
        message: (messageString) => {
            return new RichEmbed().setColor('GREEN').setAuthor(messageString, client.guilds.first().iconURL).setFooter('Built with ❤ by Rayzer 乡');
        }
    };
    fs.readdir('./src/commands', (error, files) => {
        if (error) throw error;
        files.filter(file => file.endsWith('.js')).forEach(file => {
            let props = require(`./src/commands/${file}`);
            props.info.aliases.forEach(alias => {
                client.commands[alias] = props;
            });
            client.commands[props.info.name] = props;
        });
    });
    fs.readdir('./src/events', (error, files) => {
        if (error) throw error;
        files.filter(file => file.endsWith('.js')).forEach(file => {
            let props = require(`./src/events/${file}`);
            client.on(props.name, props.run.bind(null, client));
        });
    });
});
