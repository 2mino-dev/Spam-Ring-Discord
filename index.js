const { Client } = require('discord.js-selfbot-youtsuho-v13'); 
const chalk = require('chalk');
const client = new Client();  
const { token } = require('./config.json');
  
let ringingTimeout;  
let connection;  
  
client.on('ready', async () => {  
  console.log(chalk.green('[+] | ') + chalk.white(`Spam Ring Ready: ${client.user.username}`));  
});  
  
client.on('messageCreate', async (message) => {  
  if (client.user.id !== message.author.id) return;  
  if (!['DM', 'GROUP_DM'].includes(message.channel.type)) {  
    return message.edit("```diff\n- [-] This command can only be used in DMs or Group DMs.\n```")
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
      return message.edit("```diff\n- [-] Already ringing\n```")
      connection.disconnect();
    };
    try {  
      const msg = await message.edit(`\`\`\`diff\n+ [+] Starting Call in ${label}\n\`\`\``);
      console.log(chalk.green('[+] | Starting Call')); 
      connection = await client.voice.joinChannel(message.channel.id,{
          selfDeaf: true,
          selfMute: true,
          selfVideo: true,
        });
      const ring = async () => {  
        await message.channel.ring();
        ringingTimeout = setTimeout(async () => {  
          try {  
            await msg.edit(`\`\`\`diff\n+ [+] Ringing again in ${label}\n\`\`\``);
            ring();
            
          } catch (err) {  
            console.error(err);  
          }  
        }, 1000); // this like dealy you can make it ring every 15 sec or less (my eng bad)
      };  
      ring();  
    } catch (error) {  
      console.error(error);  
      message.edit(`\`\`\`diff\n- [-] Failed: ${error.message}\n\`\`\``);  
      console.log(chalk.red('[+] | Failed to start ringing'));
    }  
  } 
});  
client.login(token);