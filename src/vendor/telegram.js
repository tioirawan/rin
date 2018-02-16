import Telegraf from 'telegraf'
import logger from 'winston'

import Rin from '../core/rin'

const command = Rin.command
const cmdLists = Rin.cmdLists

const app = new Telegraf(process.env.TELEGRAM_TOKEN)

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    logger.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.reply(Rin.defaultReply)
})

app.on('text', async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name
    const message = ctx.message.text

    const args = message.split(' ')

    logger.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): ${message}`)

    const cmd = args[0]

    let result = ''

    if (cmdLists.includes(cmd)) {
        const response = await command[cmd].handle(args)
        result = response
    } else {
        result = Rin.defaultReply
    }

    result = Rin.mdToHtml(result)

    if (result.length > 4000) {
        ctx.reply("Sorry It's too big to send")
    } else ctx.replyWithHTML(result)
})

app.catch(err => {
    logger.error('Ooops ')
    logger.error(err)
})

app.startPolling()
