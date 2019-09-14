# Discord-Plugins
Repository of my custom-made plugins for Discord

# Install
The installation for this plugin system is incredibly simple.

1) Download this repository to your computer. You can do this by either pulling it via Git or downloading the repo as a zip. Either works.
2) Setup the repo in a folder *That has no spaces in the path*. For the sake of example, I will assume `C:\Discord-Plugins`
3) Setup the `NODE_OPTIONS` environment variable.
This environment variable depends on where you downloaded this respository to. Assuming you downloaded it to `C:\Discord-Plugins`, your environment variable would be:
`NODE_OPTIONS=--require C:\Discord-Plugins\index.js`
<br>For Windows users, there is a `setup.cmd` file which can be run to perform the environment variable setup process.
4) Completely restart discord.

If you find that Discord will not start or is behaving oddly, you can uninstall by simply removing the environment variable and restarting Discord.

# Plugins
## Old Light Theme
I am one of the crazys who liked the light theme, but I do not enjoy some of the changes made with the accessibilty update Discord rolled out. As such, this plugin has a _few_ tweaks, most notably:
 - The return of certain Dark Theme elements
   - The Server Selector SideBar
   - The Channel Selector SideBar
   - The top, window-chrome title bar
 - Some of the text in the chat window has had its boldness reduced
   - Usernames
   - Messages

Accessible Light Theme | Old Light Theme Plugin
:--:|:------:
![image](https://user-images.githubusercontent.com/1479909/64905448-90935280-d6a6-11e9-9c4b-217a8e8e19c3.png) | ![image](https://user-images.githubusercontent.com/1479909/64905385-9c324980-d6a5-11e9-8095-62720feb2bcc.png)
