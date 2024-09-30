const { adams } = require('../Ibrahim/adams');
const axios = require("axios")
let { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("../lib/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("../lib/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("../lib/onlyAdmin");
const {removeSudoNumber,addSudoNumber,issudo} = require("../lib/sudo");
const { Mention } = require('../bdd/mention');
const { Command } = require('../lib/command');
const { User } = require('../lib/user');
const { Group } = require('../lib/group');

// Define a help command
const helpCommand = new Command({
  name: 'help',
  description: 'Displays a list of available commands',
  usage: 'help',
  execute: async (dest, zk, commandeOptions) => {
    const { repondre } = commandeOptions;
    const commands = await Command.getCommands();
    const helpMessage = commands.map(command => `*${command.name}* - ${command.description}`).join('\n');
    repondre(helpMessage);
  }
});

// Define a command to download and send a Telegram sticker pack
const tgsCommand = new Command({
  name: 'tgs',
  description: 'Downloads and sends a Telegram sticker pack',
  usage: 'tgs <link>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a telegramme stickers link ");
      return;
    }
    let lien = arg.join(' ');
    let name = lien.split('/addstickers/')[1] ;
    let api = 'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=' + encodeURIComponent(name) ;
    try {
      let stickers = await axios.get(api) ;
      let type = null ;
      if (stickers.data.result.is_animated === true ||stickers.data.result.is_video === true  ) {
        type = 'animated sticker'
      } else {
        type = 'not animated sticker'
      }
      let msg = `   Bwm-md-stickers-dl
      
  *Name :* ${stickers.data.result.name}
  *Type :* ${type} 
  *Length :* ${(stickers.data.result.stickers).length}
  
      Downloading...`
      await  repondre(msg) ;
      for ( let i = 0 ; i < (stickers.data.result.stickers).length ; i++ ) {
        let file = await axios.get(`https://api.telegram.org/bot891038791:AAHWB1d-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${stickers.data.result.stickers[i].file_id}`) ;
        let buffer = await axios({
          method: 'get',  // Utilisez 'get' pour télécharger le fichier
          url:`https://api.telegram.org/file/bot891038791:AAHWB1d-vi0IbH2NjKYUk-hqQ8rQuzPD4/${file.data.result.file_path}` ,
          responseType: 'arraybuffer',  // Définissez le type de réponse sur 'stream' pour gérer un flux de données
        })
        const sticker = new Sticker(buffer.data, {
          pack: nomAuteurMessage,
          author: "Bwm-md",
          type: StickerTypes.FULL,
          categories: ['🤩', '🎉'],
          id: '12345',
          quality: 50,
          background: '#000000'
        });
        const stickerBuffer = await sticker.toBuffer(); // Convertit l'autocollant en tampon (Buffer)
        await zk.sendMessage(
          dest,
          {
            sticker: stickerBuffer, // Utilisez le tampon (Buffer) directement dans l'objet de message
          },
          { quoted: ms }
        ); 
      }
    } catch (e) {
      repondre("we got an error \n", e);
    }
  }
});

// Define a command to create a new sticker
const stickerCommand = new Command({
  name: 'sticker',
  description: 'Creates a new sticker',
  usage: 'sticker <image>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put an image ");
      return;
    }
    let lien = arg.join(' ');
    let buffer = await axios({
      method: 'get',  // Utilisez 'get' pour télécharger le fichier
      url: lien ,
      responseType: 'arraybuffer',  // Définissez le type de réponse sur 'stream' pour gérer un flux de données
    })
    const sticker = new Sticker(buffer.data, {
      pack: nomAuteurMessage,
      author: "Bwm-md",
      type: StickerTypes.FULL,
      categories: ['🤩', '🎉'],
      id: '12345',
      quality: 50,
      background: '#000000'
    });
    const stickerBuffer = await sticker.toBuffer(); // Convertit l'autocollant en tampon (Buffer)
    await zk.sendMessage(
      dest,
      {
        sticker: stickerBuffer, // Utilisez le tampon (Buffer) directement dans l'objet de message
      },
      { quoted: ms }
    ); 
  }
});

// Define a command to add a user to the ban list
const banCommand = new Command({
  name: 'ban',
  description: 'Adds a user to the ban list',
  usage: 'ban <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    await addUserToBanList(user);
    repondre(`User ${user} has been added to the ban list`);
  }
});

// Define a command to remove a user from the ban list
const unbanCommand = new Command({
  name: 'unban',
  description: 'Removes a user from the ban list',
  usage: 'unban <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    await removeUserFromBanList(user);
    repondre(`User ${user} has been removed from the ban list`);
  }
});

// Define a command to add a group to the ban list
const banGroupCommand = new Command({
  name: 'bans',
  description: 'Adds a group to the ban list',
  usage: 'bans <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    await addGroupToBanList(group);
    repondre(`Group ${group} has been added to the ban list`);
  }
});

// Define a command to remove a group from the ban list
const unbanGroupCommand = new Command({
  name: 'unbans',
  description: 'Removes a group from the ban list',
  usage: 'unbans <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    await removeGroupFromBanList(group);
    repondre(`Group ${group} has been removed from the ban list`);
  }
});

// Define a command to add a user to the sudo list
const sudoCommand = new Command({
 name: 'sudo',
  description: 'Adds a user to the sudo list',
  usage: 'sudo <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    await addSudoNumber(user);
    repondre(`User ${user} has been added to the sudo list`);
  }
});

// Define a command to remove a user from the sudo list
const unsudoCommand = new Command({
  name: 'unsudo',
  description: 'Removes a user from the sudo list',
  usage: 'unsudo <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    await removeSudoNumber(user);
    repondre(`User ${user} has been removed from the sudo list`);
  }
});

// Define a command to add a group to the only admin list
const onlyAdminCommand = new Command({
  name: 'onlyadmin',
  description: 'Adds a group to the only admin list',
  usage: 'onlyadmin <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    await addGroupToOnlyAdminList(group);
    repondre(`Group ${group} has been added to the only admin list`);
  }
});

// Define a command to remove a group from the only admin list
const unonlyAdminCommand = new Command({
  name: 'unonlyadmin',
  description: 'Removes a group from the only admin list',
  usage: 'unonlyadmin <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    await removeGroupFromOnlyAdminList(group);
    repondre(`Group ${group} has been removed from the only admin list`);
  }
});

// Define a command to check if a user is banned
const isBannedCommand = new Command({
  name: 'isbanned',
  description: 'Checks if a user is banned',
  usage: 'isbanned <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    let isBanned = await isUserBanned(user);
    if (isBanned) {
      repondre(`User ${user} is banned`);
    } else {
      repondre(`User ${user} is not banned`);
    }
  }
});

// Define a command to check if a group is banned
const isGroupBannedCommand = new Command({
  name: 'isgroupbanned',
  description: 'Checks if a group is banned',
  usage: 'isgroupbanned <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    let isBanned = await isGroupBanned(group);
    if (isBanned) {
      repondre(` Group ${group} is banned`);
    } else {
      repondre(`Group ${group} is not banned`);
    }
  }
});

// Define a command to check if a user is a sudo
const isSudoCommand = new Command({
  name: 'issudo',
  description: 'Checks if a user is a sudo',
  usage: 'issudo <user>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a user ");
      return;
    }
    let user = arg.join(' ');
    let isSudo = await issudo(user);
    if (isSudo) {
      repondre(`User ${user} is a sudo`);
    } else {
      repondre(`User ${user} is not a sudo`);
    }
  }
});

// Define a command to check if a group is only admin
const isOnlyAdminCommand = new Command({
  name: 'isonlyadmin',
  description: 'Checks if a group is only admin',
  usage: 'isonlyadmin <group>',
  execute: async (dest, zk, commandeOptions) => {
    const { ms, repondre, arg, nomAuteurMessage, superUser } = commandeOptions;
    if (!superUser) {
      repondre('Only Mods can use this command'); return;
    }
    if (!arg[0]) {
      repondre("put a group ");
      return;
    }
    let group = arg.join(' ');
    let isOnlyAdmin = await isGroupOnlyAdmin(group);
    if (isOnlyAdmin) {
      repondre(`Group ${group} is only admin`);
    } else {
      repondre(`Group ${group} is not only admin`);
    }
  }
});

// Register the commands
Command.registerCommand(helpCommand);
Command.registerCommand(tgsCommand);
Command.registerCommand(stickerCommand);
Command.registerCommand(banCommand);
Command.registerCommand(unbanCommand);
Command.registerCommand(banGroupCommand);
Command.registerCommand(unbanGroupCommand);
Command.registerCommand(sudoCommand);
Command.registerCommand(unsudoCommand);
Command.registerCommand(onlyAdminCommand);
Command.registerCommand(unonlyAdminCommand);
Command.registerCommand(isBannedCommand);
Command.registerCommand(isGroupBannedCommand);
Command.registerCommand(isSudoCommand);
Command.registerCommand(isOnlyAdminCommand);