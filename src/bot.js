import { Bot } from "grammy";
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

  bot.command("random", async (ctx) => {});

  bot.catch((err) => console.error(err));

  return bot;
}
