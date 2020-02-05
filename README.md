# cycycy-bot
A scuffed bot for a discord server

Website: https://bot.cycycy.me/

Invite link: https://discordapp.com/oauth2/authorize?client_id=530305194131456000&scope=bot&permissions=8

# Install and run locally
1. Clone this repo.
2. Run ```npm install```
2. Make a ```.env``` file 
3. Inside the ```.env``` file add your own MongoDB URL with a variable ```DB_PASS```
3. Inside the ```.env``` file add your own discord bot token with a variable ```BOT_TOKEN```
4. Run the bot! ```node bot.js```

# Functions(for now)
## --- Admin Commands ---
  ### Test
  **Tests if the bot is running**
  * Usage: $test
  
  ### Role Counter
  **Returns how many members the given role have**
  * Usage: $rc <role_name>
  
  ### Set logger channel
  **Enable/Disable the event logger (message deleted, member left, member kicked, etc.)**
  * Usage: $setlogger <enable/disable> <channel_name> (channel name is optional only if you set it to disabled)
  
   ### Set Mod Role **(IMPORTANT TO SETUP)**
  **Sets the mod role of the server to be able to use mod commands**
  * Usage: $setmod <mod_role_name>
  
## --- Mod Commands ---
  ### Adding/Deleting Ban Phrase
  **Adds/Deletes a ban phrase/word to the server**
  * Usage: $addbanphrase <phrase/word>
  * Usage: $delbanphrase <phrase/word>
  
  ### Adding/Deleting/Editing custom command
  **Adds/Deletes/Edits a custom command to the server**
  * Usage: $addcmd <command_name> <command_response>
  * Usage: $delcmd <command_name>
  * Usage: $editcmd <command_name> <command_response>
  
  ### Adding/Deleting Ban Phrase
  **Adds/Deletes a ban phrase/word to the server**
  * Usage: $addbanphrase <phrase/word>
  
  ### Temporary mute/ Unmute
  **Temporarily mutes a user/Unmute a user**
  * Usage: $tempmute <tag_user> <1s/1m/1h/1d>
  * Usage: $unmute <tag_user>

  ### Kick
  **Kicks a user**
  * Usage: $kick <tag_user>
  
## --- Regular Commands ---
  ### Help
  **Shows the command and custom commands in the server**
  * Usage: $help
  
  ### Translate
  **Translates message from any language to english**
  * Usage: $translate <your_message>

  ### Wiki search
  **Returns a summary of the user's input from wikipedia**
  * Usage: $wiki <search_word> (word you want to search from wikipedia)

  ### Avatar
  **Shows the user's avatar**
  * Usage: $avatar <user> (optional)

  ### Get User Info
  **Shows the user's information in the server**
  * Usage: $userinfo <tag_user> (optional)
  
  ### Get Server Info
  **Shows the server's information**
  * Usage: $serverinfo
  
  ### Get life advice from bot
  **Gives you advice**
  * Usage: $advice
  * Usage: $cookie (24hr cooldown)

  ### AFK/GN
  **GN sets your status to sleeping/AFK sets your status to AFK**
  * Usage: $afk <your_message> (optional)
  * Usage: $gn <your_message> (optional)
  
  ### Tuck
  **Tucks the Sleeping User 4HEad**
  * Usage: $tuck <tag_user>
  
  ### Cat facts HYPERS!!
  **Gives you a fact about cats OMGSCoots**
  * Usage: $catfact
  
  ### Random Cat pictures
  **Gives you a random picture of a cat**
  * Usage: $cat
  
  ### Dog facts Wowee
  **Gives you a fact about dogs OMGSCoots**
  * Usage: $dogfact
  
  ### Random Dpg pictures
  **Gives you a random picture of a dog**
  * Usage: $dog <breed>

  ### Thesaurus
  **Gives you the definition of a word and example**
  * Usage: $thesaurus <word>
  
  ### Reminder
  **Sends a DM in a specified time**
  * Usage: $remindme <time> <message>

# Upcoming features
### ~~Weather Search~~ ✔
### ~~News Search~~ ✔
### Play a music using youtube
### Twitch Live Announcements
### ~~Wiki search~~ ✔
### ~~Translate language~~ ✔
### Trivia games
### Some mini-games

# Ultimate Goal
### ~~Build a web dashboard for the bot.~~ ✔
