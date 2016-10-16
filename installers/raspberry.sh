#!/usr/bin/env bash

# This is an installer script for DashingJS. It works well enough
# that it can detect if you have Node installed, run a binary script
# and then download and run DashingJS.

echo -e "\e[0m"
echo ' /$$$$$$$                      /$$       /$$                        /$$$$$  /$$$$$$'
echo '| $$__  $$                    | $$      |__/                       |__  $$ /$$__  $$'
echo '| $$  \ $$  /$$$$$$   /$$$$$$$| $$$$$$$  /$$ /$$$$$$$   /$$$$$$       | $$| $$  \__/'
echo '| $$  | $$ |____  $$ /$$_____/| $$__  $$| $$| $$__  $$ /$$__  $$      | $$|  $$$$$$'
echo '| $$  | $$  /$$$$$$$|  $$$$$$ | $$  \ $$| $$| $$  \ $$| $$  \ $$ /$$  | $$ \____  $$'
echo '| $$  | $$ /$$__  $$ \____  $$| $$  | $$| $$| $$  | $$| $$  | $$| $$  | $$ /$$  \ $$'
echo '| $$$$$$$/|  $$$$$$$ /$$$$$$$/| $$  | $$| $$| $$  | $$|  $$$$$$$|  $$$$$$/|  $$$$$$/'
echo '|_______/  \_______/|_______/ |__/  |__/|__/|__/  |__/ \____  $$ \______/  \______/'
echo '                                                       /$$  \ $$'
echo '                                                      |  $$$$$$/'
echo '                                                       \______/'
echo -e "\e[0m"

# Define the tested version of Node.js.
NODE_TESTED="v5.1.0"

#Determine which Pi is running.
ARM=$(uname -m)

#define helper methods.
function version_gt() { test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1"; }
function command_exists () { type "$1" &> /dev/null ;}


# Update
echo -e "\e[96mUpdate system ...\e[90m"
sudo apt-get update -y  || exit


# Installing helper tools
echo -e "\e[96mInstalling helper tools ...\e[90m"
sudo apt-get install curl wget git build-essential unzip apt-transport-https || exit

# Installing x11-xserver-utils
echo -e "\e[96mInstalling x11-xserver-utils ...\e[90m"
sudo apt-get install x11-xserver-utils || exit

# Installing unclutter
echo -e "\e[96mInstalling unclutter ...\e[90m"
sudo apt-get install unclutter || exit

# Installing chromium browser
echo -e "\e[96mInstalling helper tools ...\e[90m"
sudo apt-get install chromium-browser || exit

# Check if we need to install or upgrade Node.js.
echo -e "\e[96mCheck current Node installation ...\e[0m"
NODE_INSTALL=false
if command_exists node; then
	echo -e "\e[0mNode currently installed. Checking version number.";
	NODE_CURRENT=$(node -v)
	echo -e "\e[0mMinimum Node version: \e[1m$NODE_TESTED\e[0m"
	echo -e "\e[0mInstalled Node version: \e[1m$NODE_CURRENT\e[0m"
	if version_gt $NODE_TESTED $NODE_CURRENT; then
    	echo -e "\e[96mNode should be upgraded.\e[0m"
    	NODE_INSTALL=true

    	#Check if a node process is currenlty running.
    	#If so abort installation.
    	if pgrep "node" > /dev/null; then
		    echo -e "\e[91mA Node process is currently running. Can't upgrade."
		    echo "Please quit all Node processes and restart the installer."
		    exit;
		fi

    else
    	echo -e "\e[92mNo Node.js upgrade nessecery.\e[0m"
	fi

else
	echo -e "\e[93mNode.js is not installed.\e[0m";
	NODE_INSTALL=true
fi

sudo apt-get remove nodejs

# Install or upgrade node if necessary.
if $NODE_INSTALL; then

	echo -e "\e[96mInstalling Node.js ...\e[90m"

	#Fetch the latest version of Node.js from the selected branch
	#The NODE_STABLE_BRANCH variable will need to be manually adjusted when a new branch is released. (e.g. 7.x)
	#Only tested (stable) versions are recommended as newer versions could break DashingJS.

	NODE_STABLE_BRANCH="6.x"
	curl -sL https://deb.nodesource.com/setup_$NODE_STABLE_BRANCH | sudo -E bash -
	sudo apt-get install -y nodejs npm
	sudo ln -s /usr/bin/nodejs /usr/bin/node
	echo -e "\e[92mNode.js installation Done!\e[0m"
fi

#Install DashingJS
cd ~
if [ -d "$HOME/dashingJs" ] ; then
	echo -e "\e[93mIt seems like DashingJS is already installed."
	echo -e "To prevent overwriting, the installer will be aborted."
	echo -e "Please rename the \e[1m~/dashingJs\e[0m\e[93m folder and try again.\e[0m"
	echo ""
	echo -e "If you want to upgrade your installation run \e[1m\e[97mgit pull\e[0m from the ~/dashingJs directory."
	echo ""
	exit;
fi

echo -e "\e[96mCloning DashingJS ...\e[90m"
if git clone https://github.com/MikhaelGerbet/dashingJs.git; then
	echo -e "\e[92mCloning DashingJS Done!\e[0m"
else
	echo -e "\e[91mUnable to clone DashingJS."
	exit;
fi

# Installing bower
echo -e "\e[96mInstalling bower ...\e[90m"
sudo npm install -g bower || exit

# Installing http-server
echo -e "\e[96mInstalling http-server ...\e[90m"
sudo npm install -g http-server

cd ~/dashingJs  || exit
echo -e "\e[96mInstalling dependencies ...\e[90m"
if npm install && bower install; then
	echo -e "\e[92mDependencies installation Done!\e[0m"
else
	echo -e "\e[91mUnable to install dependencies!"
	exit;
fi

echo " "
echo -e "\e[92mWe're ready! Run \e[1m\e[97mDISPLAY=:0 npm start\e[0m\e[92m from the ~/dashingJs directory to start your DashingJS.\e[0m"
echo " "
echo " "

# Launch server
echo -e "\e[96mLaunch server ...\e[90m"
cd ~/dashingJs && npm start || exit