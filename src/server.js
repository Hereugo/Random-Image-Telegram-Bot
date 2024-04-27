import dotenv from "dotenv";
import Pocketbase from "pocketbase";
import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import unzipper from "unzipper";
import path from "path";

import createBot from "./bot.js";
import { padNumberWithZeros } from "./utils.js";

dotenv.config();

const __dirname = path.resolve();

const app = express();
app.use(bodyParser.json());
app.use(fileUpload());

const pb = new Pocketbase(process.env.PB_HOST || "http://127.0.0.1:8090");
const bots = {};

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: __dirname + "/public" });
});

app.get("/ping", (_req, res) => {
  res.send("pong");
});

app.post("/upload", async (req, res) => {
  console.log(req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const { zip } = req.files;

  if (!zip || zip.mimetype !== "application/zip") {
    return res.status(400).send("Invalid file type.");
  }

  const dir = await unzipper.Open.buffer(zip.data);

  let count = 0;
  for (const file of dir.files) {
    let formData = new FormData();

    let blob = new Blob([await file.buffer()]);

    formData.append("image", blob);

    let res = await pb.collection("images").create(formData);
    if (res.code) {
      console.log(res);
    } else {
      count += 1;
    }
  }

  res.json({
    message: `Successfully uploaded ${count} out of ${dir.files.length} images.`,
    count: count,
    total: dir.files.length,
  });
});

app.post("/webhook/bots", async (req, res) => {
  const botData = req.body;
  var bot;

  try {
    let message = "";

    if (botData.isActive) {
      if (!bots.hasOwnProperty(botData.TOKEN)) {
        bot = createBot(botData.TOKEN, pb);
        bots[botData.TOKEN] = bot;

        bot.start();

        message = `Bot ${botData.TOKEN} has been started!`;
      } else {
        bot = bots[botData.TOKEN];
        message = `Bot ${botData.TOKEN} is already running!`;
      }
    } else {
      if (bots.hasOwnProperty(botData.TOKEN)) {
        bot = bots[botData.TOKEN];

        bot.stop();

        delete bots[botData.TOKEN];

        message = `Bot ${botData.TOKEN} has been stopped!`;
      } else {
        // Create a bot instance to get the bot info
        bot = createBot(botData.TOKEN, pb);
        message = `Bot ${botData.TOKEN} is not running!`;
      }
    }

    const botInfo = await bot.api.getMe();

    return res.status(200).json({
      message,
      bot: {
        id: padNumberWithZeros(botInfo.id),
        username: botInfo.username,
        firstName: botInfo.first_name || "",
        lastName: botInfo.last_name || "",
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
});

const port = 3000;
app.listen(port, async () => {
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL,
    process.env.PB_ADMIN_PASSWORD,
  );

  const botsData = await pb.collection("bots").getFullList({
    filter: "isActive=true",
  });

  botsData.forEach((botData) => {
    if (!bots.hasOwnProperty(botData.TOKEN)) {
      const bot = createBot(botData.TOKEN, pb);
      bots[botData.TOKEN] = bot;

      bot.start();
      console.log(`Bot ${botData.TOKEN} has been started!`);
    }
  });

  console.log(`Server is running on port ${port}`);
});
