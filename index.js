const {Telegraf} = require('telegraf');
const keepAlive = require('./keepAlive.js');
const fetch = require('node-fetch');
const { Markup, Composer } = require('telegraf');



const mySecret = process.env['TG-API-KEY']


//const delayTime = 500; can be ued if required.....

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
  

//start command
bot.start((ctx) => {
  ctx.reply('Welome to WordCanvas! Choose a model and send me a prompt to generate an image.');
});


let text = '';
//handling /imagine command
bot.command('imagine', async (ctx) => {
  // Extract the text parameter from the command arguments
  const prompts = ctx.message.text.substring(9);

  // If a new prompt is provided, update the promptText variable
  if (prompts) {
    text = prompts;
  }
  
  if (!text) {
    return ctx.reply('Use this syntax: "/imagine <Better the prompt, better the image>". E.g.: /imagine Astronaut riding on a horse. 🦚🦄🐬');
   
  }
  await ctx.reply('Art is all about time, so have patience. 🐠🦕🐬')
  

  // Ask the user for image quality
  const qualityKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('High Quality(Slow)', 'hq'),
    Markup.button.callback('Low Quality(Fast)', 'lq')
  ]);

  await ctx.reply('What quality of image do you want?', qualityKeyboard);

  // Listen for user's choice
  const qualityListener = new Composer();
  qualityListener.action('hq', async (ctx) => {
    await ctx.answerCbQuery('High quality selected');
    await generateImage(ctx, text, true);
  });
  qualityListener.action('lq', async (ctx) => {
    await ctx.answerCbQuery('Low quality selected');
    await generateImage(ctx, text, false);
  });
  bot.use(qualityListener);

  console.log(text);

  async function generateImage(ctx, text, isHighQuality) {
    console.log("high_quality:", isHighQuality.toString())
 
  // Handling the API 
const model = process.env['Model_Endpoint']
 fetch(model,{
  method:"POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  "prompt": text,
  "high_quality": isHighQuality.toString()
})
})
.then(res=>res.json())
.then(async (data) => {
  const imageData = data.image.split(",")[1];
    const imageBuffer = Buffer.from(imageData, "base64");

 // use telegraf's replyWithPhoto method to send the image to the user
    ctx.replyWithPhoto({ source: imageBuffer });

    console.log("Photo sent!");
 // console.log(await data); can be ued if required.....
  
})
 
  } 
  
});





keepAlive();
// start the bot
bot.startPolling();
