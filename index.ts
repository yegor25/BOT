const { Telegraf, Markup, Composer, Scenes, session } = require('telegraf')
require('dotenv').config()
const text = require('./const.ts')
const https = require('https')
const fs = require('fs')
const sequelize = require('./db')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'bye'}`))

bot.help((ctx) => ctx.reply(text.commands))
bot.command('course', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Курсы</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Для любимой ', 'btn_1'), Markup.button.callback('Нужна ли нам собака?', 'btn_2')]
            ]
        ))
    } catch (error) {
        console.log(error);

    }

})
bot.command('get', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b> Пользователь github.com</b>', Markup.inlineKeyboard(
            [Markup.button.callback(' username ', 'btn_3')]

        ))
    } catch (error) {

    }
})

const addActinBot = (name, src, text) => {
    bot.action(name, async (ctx) => {
        try {
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
                bot.on('text', () => {
                    console.log(ctx.text.message);
                })


            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true,

            })

        } catch (error) {

        }
    })
}


function download( url,dest, cb) {
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
const dest  = './first3.zip'
//const url = `https://codeload.github.com/yegor25/yegor25/zip/master`
bot.hears('hi', (ctx) => {
    ctx.reply('show')
    
})
const getRepoName = (name) => {
    try {
        bot.action(name, async (ctx) => {
            ctx.reply('Введите имя репозитория', bot.use((ctx) => {
                console.log('ctxRepo', ctx.message.text);

            }))
        })

    } catch (error) {

    }
}
const getDataUser = () => {
    try {
        bot.action('btn_3', async (ctx, next) => {
            console.log('call', ctx.callbackQuery.data);



            ctx.reply('Введите github username', bot.use((ctx) => {

               ctx.state.userName = ctx.message.text
               
            })

            )



            bot.action('btn_4', async (ctx) => {
                console.log('btn4');

              
            })



        })


    } catch (error) {

    }
}

let gitName = ''
let reposName = ''
const startWizard = new Composer()
startWizard.action('btn_10', async (ctx) => {
    ctx.wizard.state.data = {}
    await ctx.reply('Введите github nickName')
    console.log('ct',ctx.wizard.state.data);
    
    
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
repoName.on('text', async(ctx) => {
    ctx.wizard.state.data.repoName = ctx.message.text
    const url = `https://codeload.github.com/${ctx.wizard.state.data.gitUserName}/${ctx.wizard.state.data.repoName}/zip/master`

   
    
   await ctx.reply('Ожидайте...')
   console.log('url', url);
   
   download( url,dest,() => {})
   bot.telegram.sendDocument(
    ctx.chat.id, url
   )
   console.log('state',ctx.wizard.state.data);
  
   return ctx.scene.leave()
})

const menuScene = new Scenes.WizardScene('sceneWizard', startWizard, userName, repoName)

const stage = new Scenes.Stage([menuScene])
bot.use(session())
bot.use(stage.middleware())

bot.command('chat', (ctx) => {
    ctx.scene.enter('sceneWizard')
    ctx.replyWithHTML('Выбирите действие', Markup.inlineKeyboard(
        [Markup.button.callback('Получить репозиторий', 'btn_10')]
    ))
})


addActinBot('btn_2', './img/dog.jpg', 'Очень')
addActinBot('btn_1', false, '❤ Я тебя очень люблю')


getDataUser()
getRepoName('btn_4')

bot.launch()

const server = https.createServer()
server.listen(5000, async() => {
    try {
       
        console.log('server work');
    } catch (error) {
        
    }
    
    
})

