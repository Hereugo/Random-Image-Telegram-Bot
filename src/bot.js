import { Bot, InputFile, InputMediaBuilder } from "grammy";
import { padNumberWithZeros } from "./utils.js";

export default function createBot(token, pb) {
  const bot = new Bot(token);

  // middleware to create new user if not exists
  bot.use(async (ctx, next) => {
    var user;
    try {
      user = await pb
        .collection("users")
        .getOne(padNumberWithZeros(ctx.from.id));
    } catch (err) {
      console.log("Error: ", err.message);

      const data = {
        id: padNumberWithZeros(ctx.from.id),
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        username: ctx.from.username,
        phoneNumber: ctx.from.phone_number,
        languageCode: ctx.from.language_code,
        isAllowed: true,

        password: "12345678",
        passwordConfirm: "12345678",
      };

      user = await pb.collection("users").create(data);
    }

    ctx.userInfo = user;

    if (!user.isAllowed) {
      return ctx.reply("You are not allowed to use this bot.");
    }

    await next();
  });

  //middleware for botDb info
  bot.use(async (ctx, next) => {
    ctx.config = await pb
      .collection("bots")
      .getOne(padNumberWithZeros(ctx.me.id));

    await next();
  });

  bot.command("ping", async (ctx) => {
    await ctx.reply(`Pong! ${new Date()} ${Date.now()}`);
  });

  bot.command("start", async (ctx) => {
    await ctx.reply("Hello world!");
  });

  bot.hears(/random *([0-9]+)?/, async (ctx) => {
    const message = ctx.message.text;
    const count = message.split("random ")[1] || 1;

    if (count > 10 || count < 1) {
      return ctx.reply("Please provide a number between 1 and 10.");
    }

    const botmsg = await ctx.reply("Please wait...");

    const records = await pb.collection("images").getFullList({
      sort: "-created",
    });

    let rep = count;
    let buffers = [];
    while (rep--) {
      // get a random image
      const randomIndex = Math.floor(Math.random() * records.length);
      const randomImage = records[randomIndex];
      const firstFilename = randomImage.image;

      const imageUrl =
        pb.files.getUrl(randomImage, firstFilename) + "?download=1";

      buffers.push(fetch(imageUrl).then((response) => response.arrayBuffer()));
    }

    Promise.all(buffers)
      .then(async (buffers) => {
        await ctx.api.editMessageText(
          ctx.chat.id,
          botmsg.message_id,
          "Sending images...",
        );

        await ctx.replyWithMediaGroup(
          buffers.map((buffer) =>
            InputMediaBuilder.photo(new InputFile(new Uint8Array(buffer))),
          ),
        );

        await ctx.api.deleteMessage(ctx.chat.id, botmsg.message_id);
      })
      .catch((err) => console.error(err));
  });

  bot.catch((err) => console.error(err));

  return bot;
}
