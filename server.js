const express = require("express");
const app = express();
app.use(express.static("public"));
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
const Discord = require("discord.js");
const config = require("./config.json");
const prefix = config.prefix;
const ownerID = "520844929442775070"; //that is my ID! Make sure you put your ID here!
const bot = new Discord.Client();

bot.on("guildMemberAdd", (member) => {
let guild = member.guild; // Reading property `guild` of guildmember object.
let memberTag = member.user.tag; // GuildMembers don't have a tag property, read property user of guildmember to get the user object from it
if(guild.systemChannel){ // Checking if it's not null
	guild.systemChannel.send(memberTag + " has joined!");
}
});

bot.on("ready", () => {
  bot.user.setActivity("*help", { type: "WATCHING" });
  console.log("logged into: " + bot.user.tag);
});

bot.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "eval") {
    if (message.author.id == 520844929442775070) {
      try {
        const code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        message.channel.send(evaled);
      } catch (err) {
        console.log(err);
      }
    }
  }

  if (command === "ping") {
    message.channel.send(":ping_pong: Pong! " + Math.round(bot.ping) + "ms!");
  }

  if (command === "servers") {
    message.channel.send(`Serving ${bot.guilds.size} servers`);
    message.channel.send(bot.guilds.map(g => g.name).join("\n"));
  }
  if (command === "8ball") {
    let question = message.content
      .split(/\s+/g)
      .slice(1)
      .join(" ");

    if (!question) {
      return message.channel.send(`You must provide a question.`);
    }

    var answer = [
      "It is certain",
      "It is decidedly so",
      "Without a doubt",
      "Yes, definitely",
      "You may rely on it",
      "As I see it, yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Don't count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful",
      "IDK bro"
    ];
    const ballEmbed = new Discord.RichEmbed()
      .setAuthor(question)
      .setDescription(
        answer[Math.round(Math.random() * (answer.length - 1))] + "."
      )
      .setColor("#fcba03")
      .setTimestamp();
    message.channel.send(ballEmbed);
  }
  
  if (command === "uptime") {
    let totalSeconds = bot.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let uptime = `${days} days, ${hours} hours, and ${minutes} minutes`;
    message.channel.send(uptime);
  }
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }

  if (command == "ht") {
    function doRandHT() {
      var rand = ["HEADS!", "TAILS!"];

      return rand[Math.floor(Math.random() * rand.length)];
    }

    const embed = {
      title: `Here is the winner!`,
      description: doRandHT(),
      color: 7584788
    };
    message.channel.send({ embed });
  }
  if (command === "ticketsetup") {
    const embed = new Discord.RichEmbed()
      .setTitle("How to setup the ticket command.")
      .setDescription('**1.**\nCreate a category called "Tickets"')
      .addField(
        "2.",
        "Make the category access to Moderators only in your server."
      )
      .addField(
        "3.",
        'Create a role named "TicketUse" and apply the role to all mods.'
      )
      .setColor("#fcba03");
    message.channel.send(embed);
  }

  if (command === "kick") {
    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member)
      return message.channel.send(
        "Error: Missing Arguments You Need to either " +
          "`mention`" +
          " Or give a member " +
          "`ID`"
      );

    if (!member.kickable)
      //check if the bot can kick the member
      return message.channel.send(`Error: I cannot kick ${member.user.tag}`); //return if fasle.

    let reason = args.slice(1).join(" "); //make the message string
    if (!reason) reason = "no reason given"; //if no reason was given, reason just means no reason given

    member.kick(reason); //kick the member
    message.channel.send(
      `Successfully kicked ${member.user.tag}\nFor: ${reason}`
    ); //send a message indacting the member had been banned.
  }
  if (command === "warn") {
    var embedColor = "#FF0000"; // Change this to change the color of the embeds!

    var missingPermissionsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the user is missing permissions
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Insufficient Permissions!")
      .setDescription(
        "You need the `KICK_MEMBERS` permission to use this command!"
      )
      .setTimestamp();
    var missingArgsEmbed = new Discord.RichEmbed() // Creates the embed thats sent if the command isnt run right
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle("Missing Arguments!")
      .setDescription("Usage: t!warn [@User] [Reason]")
      .setTimestamp();
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.channel.send(missingPermissionsEmbed); // Checks if the user has the permission
    let mentioned = message.mentions.users.first(); // Gets the user mentioned!
    if (!mentioned) return message.channel.send(missingArgsEmbed); // Triggers if the user donsn't tag a user in the message
    let reason = args.slice(1).join(" "); // .slice(1) removes the user mention, .join(' ') joins all the words in the message, instead of just sending 1 word
    if (!reason) return message.channel.send(missingArgsEmbed); // Triggers if the user dosn't provide a reason for the warning

    var warningEmbed = new Discord.RichEmbed() // Creates the embed that's DM'ed to the user when their warned!
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`You've been warned in ${message.guild.name}`)
      .addField("Warned by", message.author.tag)
      .addField("Reason", reason)
      .setTimestamp();
    mentioned.send(warningEmbed); // DMs the user the above embed!
    var warnSuccessfulEmbed = new Discord.RichEmbed() // Creates the embed thats returned to the person warning if its sent.
      .setColor("#00ff00")
      .setTitle("User Successfully Warned!");
    message.channel.send(warnSuccessfulEmbed); // Sends the warn successful embed
    message.delete(); // Deletes the command
  }
  if (command === "ban") {
    let member =
      message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!member)
      return message.channel.send(
        "Error: Missing Arguments You Need to either " +
          "`mention`" +
          " Or give a member " +
          "`ID`"
      );

    if (!member.bannable)
      //check if the bot can ban the member
      return message.channel.send(`Error: I cannot ban ${member.user.tag}`); //return if fasle.

    let reason = args.slice(1).join(" "); //make the message string
    if (!reason) reason = "no reason given"; //if no reason was given, reason just means no reason given

    member.ban(reason); //ban the member
    message.channel.send(
      `Successfully banned ${member.user.tag}\nFor: ${reason}`
    ); //send a message indacting the member had been banned.
    //done! //and the say command //to lazy LMAO //plzzzzz //its simple it just uses args //I need help with the perms.has part why do you even use that lmao
  }

  if (command === "say") {
    if (!message.member.permissions.has("MANAGE_MESSAGES"))
      return message.channel.send(
        "You don't have permissions to use this command."
      ); //done, they need the 'BAN_MEMBERS' permission to use the command.
    let saymessage = args.join(" "); //
    if (!saymessage) return message.channel.send("Please Give Text"); //return a message if they don't provide text.
    message.channel.send(saymessage); //send the message.
    message.delete();
  }

  if (command === "purge") {
    let has_mngmsg = perms.has("MANAGE_MESSAGES");
    if (has_mngmsg) {
      const deleteCount = parseInt(args[0], 10);
      if (!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply(
          "Please provide a number between 2 and 100 for messages to purge"
        );
      const fetched = message.channel.fetchMessages({ limit: deleteCount });
      message.channel
        .bulkDelete(fetched)
        .catch(err => message.reply(`Error; ${err}`));
    } else {
      message.reply("You cannot use that!");
    }
  }
  if (command === "help") {
    let embed = new Discord.RichEmbed()
      .setTitle("Help Menu")
      .setColor("#0663d4")
      .setDescription("Here are my commands!")
      .addField(
        "*say",
        "This command can be ran by people who has `BAN_MEMBERS` permission"
      )
      .addField("*eval", "This Command can only be accessed by the `bot Owner`")
      .addField(
        "*ban",
        "This command can be accessed by members with `BAN_MEMBERS`"
      )
      .addField(
        "*kick",
        "This command can be accessed by members with `KICK_MEMBERS`"
      )
      .addField(
        "*purge",
        "This command can be accessed by members with `MANAGE_MESSAGES`"
      )
      .addField(
        "*servers",
        "This command shows how many servers the bot is in!"
      )
      .addField(
        "*uptime",
        "This command shows how long the bot has been online!"
      )
      .addField("*botinfo", "This command shows you the info on the bot")
      .addField("*reset", "This command allows QMT-Malware to restart the bot")
      .addField(
        "*status",
        "This command allows QMT-Malware to set the status on the bot"
      )
      .addField("*media", "This command shows My social medias")
      .addField(
        "*donate",
        "This command post the bot devlopers paypal so you can donate"
      )
      .addField("*ticket", "This command will allow you open a ticket")
      .addField(
        "*users",
        "this command allows QMT-Malware to see how many users there are between every server the bot is in"
      )
      .addField("*play", "use this command to play the song you want")
      .addField("*ticketsetup", "This command will help you setup tickets")
      .addField("*stop", "use this command to stop the music")
      .addField("*warn", "This command will warn the user")
      .addField(
        "**NOTE**",
        "This bot is still being developed. We might add some more commands going along! Thanks! -malware "
      )
      .addField("*ht", "use this to help you decide ")
      .addField("**soontocome**", "gambling,");
    message.channel.send(embed);
  }

  if (command === "test") {
    message.channel.send(
      "I am online and working very well! There is no need to test me! LOL"
    );
    message.delete();
  }

  if (command === "hug") {
    message.channel.send("I shall give ~QMT~Malware~ a hug!");
    message.delete();
  }

  if (command === "botinfo") {
    let embed = new Discord.RichEmbed()
      .setTitle("Bot Information")
      .setColor("#ec3eff")
      .setDescription("Here is my information")
      .addField("Developer:", "QMTMalware")
      .addField("Command Helper:", "TheFirstMine_PH#6062")
      .addField("Date I was created:", "28 September 2019")
      .addField("If you need any help with the bot, Please DM:", "QMTMalware")
      .addField("**Note**", "There is more to come in the future!");
    message.channel.send(embed);
  }
  if (command === "reset") {
    if (message.author.id == ownerID) {
      resetBot(message.channel);
      function resetBot(channel) {
        message.channel.send("Bot is restarting");
        bot.user.setActivity(`Restarting......`);
        message
          .reply("✅ Bot has been restarted successfully!")
          .then(msg => bot.destroy())
          .then(() => bot.login(process.env.TOKEN));
      }
    }
  }

  if (command === "invite") {
    message.channel
      .createInvite({ maxAge: 0 }) //Never Expires
      .then(invite => message.author.send(`${invite}`)); //Sends to DMs
  }
  if (command === "status") {
    if (message.author.id == ownerID) {
      bot.user.setActivity(`${args.join(" ")}`);
      message.channel.send("✅ Successfully changed status");
    }
  }

  if (command === "ticket") {
    if (args[0] == "new") {
      const category = message.guild.channels.find(
        c => c.name == "Tickets" && c.type == "category"
      );
      if (category) {
        const everyone2 = message.guild.roles.find(r => r.name == "@everyone");
        const ticket = await message.guild.createChannel(
          `ticket-${message.author.username}-${message.author.discriminator}`,
          { type: "text" }
        );
        const everyone = message.guild.roles.find(r => r.name == "@everyone");
        const modRole = message.guild.roles.find(r => r.name == "TicketUse");
        const botRole = message.guild.roles.find(r => r.name == "QMT-Bot");
        ticket.setParent(category.id);
        ticket.setTopic(
          `\' *ticket close\'to close ticket.Author ID:${message.author.id}`
        );
        ticket.overwritePermissions(message.author, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
          ATTACH_FILES: true
        });
        ticket.overwritePermissions(everyone, {
          VIEW_CHANNEL: false,
          SEND_MESSAGES: false,
          READ_MESSAGE_HISTORY: false
        });
        ticket.overwritePermissions(botRole, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true
        });
        ticket.overwritePermissions(modRole, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
          ATTACH_FILES: true
        });

        message.reply(`Your ticket has been created, <#${ticket.id}>`);
        const embed = new Discord.RichEmbed()
          .setTitle("Opened!")
          .setThumbnail(message.author.avatarURL)
          .setColor("#fcba03")
          .setDescription(
            `This ticket has been opened by ${message.author.tag}` +
              ".\n\n" +
              `Subject: ${args.slice(1).join(" ")}`
          );
        bot.channels.get(ticket.id).send(embed);
      } else {
        message.channel.send(
          'Please ask one of the admins to make a category named "Tickets"'
        );
      }
    } else if (
      args[0] == "close" &&
      message.channel.name.startsWith("ticket")
    ) {
      //these 2 lines
      message.author.send(`Ticket closed.`);
      if (!message.channel.name.startsWith("ticket"))
        return message.reply("That command only works inside a ticket"); //and this one
      message.channel.delete();
    }
  }
  if (command === "donate") {
    message.channel.send("https://paypal.me/BioH4zardX?locale.x=en_US");
    message.delete();
  }
  if(command === 'dm'){
const user = message.mentions.users.first()
const member = message.guild.member(user)
if(user){
if(member){
message.delete()
member.send('From: '+message.author.tag+' '+args.join(" ").slice(0))
}else{
message.reply('That user is not in this guild')
}}else{
message.reply('Mention a user to DM')
}}
  if(command === 'poll'){
    let question = args.join(" ")
    message.channel.send(question).then(m => m.react("✔").then(m.react("✖")))
    message.delete()
  }
   if(command === 'userinfo'){
    const user = message.mentions.users.first() || bot.fetchUser()
    const member = message.guild.member(user)
    const embed = new Discord.RichEmbed()
    .setTitle('User Info!')
    .addField('Name and User Tag', user.tag)
    .addField('User ID', user.id)
    .addField('Joined this server at', message.guild.joinedAt)
    .addField('Joined Discord at', user.createdAt)
    .addField('Roles:', member.roles.map(role => role.name))
    .setThumbnail(user.displayAvatarURL)
    .setColor('#fcba03')
    .setTimestamp()
    message.channel.send(embed)
  }
  if (command === "invite") {
    message.channel
      .createInvite({ maxAge: 0 }) //Never Expires
      .then(invite => message.author.send(`${invite}`)); //Sends to DMs
  }
  if (command === "media") {
    message.channel.send(
      "my youtube https://tinyurl.com/QMT-Malware  My discord QMT-Malware#9048"
    );
    message.delete();
  }
  if (command === "users") {
    if (message.author.id == 520844929442775070) {
      message.channel.send(`${bot.users.size} users...`);
    }
  }
});

bot.login(process.env.TOKEN);