const { Telegraf, Markup, Composer, Scenes, session } = require('telegraf')
require('dotenv').config()
const text = require('./constants.ts')
const https = require('https')
const fs = require('fs')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.help((ctx) => ctx.reply(text.commands))
function download(url, dest, cb) {
    const file = fs.createWriteStream(dest);
    const request = https.get(url, async function (response) {
        await response.pipe(file);
        await file.on('finish', async function () {
            await file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

// Download latest archive from GitHub to temp folder
const dest = './first3.zip'

const startWizard = new Composer()
startWizard.action('btn_10', async (ctx) => {
    ctx.wizard.state.data = {}
    await ctx.reply('Введите github nickName')

    return ctx.wizard.next()
})

const userName = new Composer()
userName.on('text', async (ctx) => {
    ctx.wizard.state.data.gitUserName = ctx.message.text

    await ctx.replyWithHTML('Введите имя репозитория', Markup.inlineKeyboard(Markup.button.callback(
        ['Репозиторий', 'btn_11']
    )


    ))

    return ctx.wizard.next()
})
const repoName = new Composer()
repoName.on('text', async (ctx) => {
    ctx.wizard.state.data.repoName = ctx.message.text
    const url = `https://codeload.github.com/${ctx.wizard.state.data.gitUserName}/${ctx.wizard.state.data.repoName}/zip/master`



    await ctx.reply('Ожидайте...')
    console.log('url', url);

    download(url, dest, () => { })
    bot.telegram.sendDocument(
        ctx.chat.id, url
    )
    console.log('state', ctx.wizard.state.data);

    return ctx.scene.leave()
})

const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, userName, repoName)

const stage = new Scenes.Stage([menuScene])

bot.use(session())
bot.use(stage.middleware())
bot.hears('hi', async (ctx) => {
    ctx.reply('hello, all it work')
})
bot.command('get', (ctx) => {
    ctx.scene.enter('sceneWizard')
    ctx.replyWithHTML('Выбирите действие', Markup.inlineKeyboard(
        [Markup.button.callback('Получить репозиторий', 'btn_10')]
    ))
})

bot.launch()

const server = https.createServer()

server.listen(5000, async () => {
    console.log('server started on 5000...');

})