const {Telegraf} = require('telegraf');
const keepAlive = require('./keepAlive.js');
const fetch = require('node-fetch');

const mySecret = process.env['TG-API-KEY']


const delayTime = 500;

// Create a new Telegraf bot instance
const TELEGRAM_BOT_TOKEN = mySecret

const bot = new Telegraf(TELEGRAM_BOT_TOKEN, {
  session: true,
});

//handle status command
bot.command('status', (ctx) => {
  ctx.reply('Click on the link to check service uptime status👉 https://scimathistlab.betteruptime.com/');
});

// create the inline button with the web app URL ?????




//promptart command
bot.command('promptart', async (ctx) => {
   ctx.reply('Click the link to launch the web app👉 https://t.me/WordCanvasBot/promptart')
});

//inspire command
bot.command('inspire', async (ctx) => {
   ctx.reply('Click the link to learn how to write better stable-diffusion prompts👉 https://www.greataiprompts.com/image-prompts-page/')
});
  


// Define the query function to call the hugging space models inference API................................................

//start command
bot.start((ctx) => {
  ctx.reply('Welome to WordCanvas! Choose a model and send me a prompt to generate an image.');
});



//handling /imagine command
bot.command('imagine', async (ctx) => {
  // Extract the text parameter from the command arguments
  const text = ctx.message.text.substring(8);
  if (!text) {
    return ctx.reply('Use this syntax: "/imagine <Better the prompt, better the image>". E.g.: /imagine Astronaut riding on a horse. 🦚🦄🐬');
   
  }
  await ctx.reply('Art is all about time, so have patience. 🐠🦕🐬')
  
  const mySecret = process.env['Model_Endpoint']
  fetch(mySecret,{
  method:"POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  "prompt": text,
  "high_quality": "false"
})
})
.then(res=>res.json())
.then(async (data) => {
  //console.log(await data);
  // start building cool stuff with data
  const imageData = data.image.split(",")[1];
  const imageBuffer = Buffer.from(imageData, "base64");
  ctx.replyWithPhoto({ source: imageBuffer });
  console.log('photo sent');
})

  
});





keepAlive();
// start the bot
bot.startPolling();
