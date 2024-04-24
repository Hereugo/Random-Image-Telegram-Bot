# Random Image Telegram Bot

This is a telegram bot that serves random amount of images when requested.

## Screenshots

TODO:

- [x] Configure pocketbase to work
- [x] Setup telegram bot to output hello world
- [ ] Somehow manage 500 images
- [ ] Make command /random <number here>

## Features

- [x] Running multiple instances of ChatGPT telegram bots
- [x] Admin Panel for managing messages, bots, users, and groups.
- [ ] Simple ChatGPT telegram bot for groups and channels

## Technologies

- Pocketbase
- Grammy
- Node.js
- Express

## Getting Started

### Configuration

Customize the configuration by copying `.env.example` and renaming it to `.env`, then editing the required parameters as desired:

| Parameters   | Description    |
|--------------- | --------------- |
| PB_ADMIN_EMAIL   | Email used to register to pocketbase first time. |
| PB_ADMIN_PASSWORD  | Password used to register to pocketbase first time. |

### Installing

Clone the repository and navigate to the project directory:

```
git clone https://github.com/Hereugo/Random-Image-Telegram-Bot.git 
cd Random-Image-Telegram-Bot 
```

#### Running Locally

Run pocketbase

```
./pocketbase/pocketbase serve 
```

Run server in root.

```
npm run start
```

### Running using Docker Compose

TODO

## Authors

- Amir Nurmukhambetov [github link](https://github.com/hereugo)
