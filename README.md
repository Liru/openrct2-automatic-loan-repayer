# OpenRCT2 Automatic Loan Repayer

An OpenRCT2 plugin that automatically repays your loan when you have the money to do so, with basic interval choice, automatic disabling when a bigger loan is taken out, and a notification when the loan has finished being paid off.

This plugin was initially made because I'm a weirdo who likes leaving Alton Towers, Blackpool Pleasure Beach, and Heide-Park on in the background and watching the debt slowly go down.

## Installation

This plugin was tested under version `0.4.12`. It will likely work on previous versions with a few tweaks (likely just the API version), but that's not a priority at the moment.

1. Go to the [releases](https://github.com/Liru/openrct2-automatic-loan-repayer/releases) page and download the latest release.\
Save it in the `plugin` subfolder of your OpenRCT2 user directory. On Windows, this is usually at `C:Users\{User}\Documents\OpenRCT2\plugin`.
2. Start OpenRCT2 and open a scenario.

## Usage

To open the settings window, click on the map menu in the upper toolbar, and select `Automatic Loan Repayer`. This is a small menu with very few settings.

* **Enable auto repayment** - Enables auto repayment. Fairly self explanatory. This plugin won't run if this is not enabled.
* **Attempt to repay every** - chooses an interval at which repayment is attempted. The three choices available here are `tick`, `day`, and `month`. (One tick is roughly 1/40th of a second.) I've found that `tick` doesn't cause any issues even at turbo speed, but if it does, well, that's what the other settings are for.

If a loan is taken out, this plugin will disable itself so that it doesn't automatically pay off what was just borrowed.

If the loan is paid off, a notification will appear, and the plugin will disable itself as well.

This plugin currently only works with singleplayer mode, as I'm not sure to what extent this should be replicated in multiplayer.


## For developers: building the source code

1. Install latest version of [Node](https://nodejs.org/en/) and make sure to include NPM in the installation options.
2. Clone the project to a location of your choice on your PC.
3. Open command prompt, use `cd` to change your current directory to the root folder of this project and run `npm install`.
4. Find `openrct2.d.ts` TypeScript API declaration file in OpenRCT2 files and copy it to `lib` folder (this file can usually be found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/bin/` or `C:/Program Files/OpenRCT2/`).
    - Alternatively, you can make a symbolic link instead of copying the file, which will keep the file up to date whenever you install new versions of OpenRCT2.
5. Run `npm run build` (release build) or `npm run build:dev` (develop build) to build the project.
    - For the release build, the default output folder is `(project directory)/dist`.
    - For the develop build, the project tries to put the plugin into your game's plugin directory.
    - These output paths can be changed in `rollup.config.js`.

### Output paths

These output paths can be changed in `rollup.config.js`. In this file you can also change the outputted filename of the plugin.

### Hot reload

This project supports the [OpenRCT2 hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) for development.

1. Make sure you've enabled it by setting `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`.
2. Open command prompt and use `cd` to change your current directory to the root folder of this project.
3. Run `npm start` to start the hot reload server.
4. Use the `/OpenRCT2/bin/openrct2.com` executable to [start OpenRCT2 with console](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) and load a save or start new game.
5. Each time you save any of the files in `./src/`, the server will compile `./src/plugin.ts` and place compiled plugin file inside your local OpenRCT2 plugin directory.
6. OpenRCT2 will notice file changes and it will reload the plugin.

If your local OpenRCT2 plugin folder is not in the default location, you can specify a custom path in `rollup.config.js`.

## Final notes

This project started from [Basssiiie](https://github.com/Basssiiie/OpenRCT2-Simple-Typescript-Template)'s TypeScript OpenRCT2 plugin template. 