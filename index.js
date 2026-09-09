/**
 *  well i know my code is soo bad but this is my first selfbot with javascript
 *  also i am learning javascript
 *  and thank you
 */

const { Client } = require('discord.js-selfbot-vg18-v13');
const chalk = require('chalk');
const client = new Client();  
const { token, interval } = require('./config.json');

let ringingTimeout;  
let connection;  

client.on('ready', async () => {  
  console.log(chalk.green('[+] | ') + chalk.white(`Spam Ring Ready: ${client.user.username}`));  
});  
  
client.on('messageCreate', async (message) => {  
  if (client.user.id !== message.author.id) return;  
  if (!['DM', 'GROUP_DM'].includes(message.channel.type)) {  
    return message.reply("```diff\n- [-] This command can only be used in DMs or Group DMs.\n```")
  }  
  const label = message.channel.type === 'DM' ? 'DM' : 'Group DM';  
  
  if (message.content === '!stop') {  
    if (ringingTimeout) {  
      clearTimeout(ringingTimeout);  
      ringingTimeout = null;
      await message.channel.stopRinging();
      if (connection) {
        await connection.disconnect();
        connection = null;
      }  
      await message.reply("```diff\n- [-] Ringing stopped\n```");
      console.log(chalk.red('[-] Ringing stopped'));
    }
    return; 
  }   
  
  if (message.content === '!start') {  
    if (ringingTimeout) return;
    else if (connection) {
      await connection.disconnect();
      connection = null;
      return message.reply("```diff\n- [-] Already ringing\n```")
    };
    try {  
      await message.reply(`\`\`\`diff\n+ [+] Starting Call in ${label}\n\`\`\``);
      console.log(chalk.green('[+] | Starting Call')); 
      connection = await client.voice.joinChannel(message.channel.id,{
          selfDeaf: true,
          selfMute: true,
          selfVideo: false,
        });
      const ring = async () => {
        if (!connection) return;
        await message.channel.ring();
        ringingTimeout = setTimeout(async () => {  
          try {  
            console.log(chalk.green(`[+] Ringing again in ${label}`));
            ring();
          } catch (err) {  
            console.error(err);  
          }  
        }, interval); // this like dealy you can make it ring every 15 sec or less in config.json (my eng bad)
      };
      ring();
    } catch (error) {  
      console.error(error);  
      message.reply(`\`\`\`diff\n- [-] Failed: ${error.message}\n\`\`\``);  
      console.log(chalk.red('[+] | Failed to start ringing'));
    }  
  } 
});  
client.login(token);
