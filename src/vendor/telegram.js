import Telegraf from 'telegraf'

import Rin from '../core/rin'

const app = new Telegraf(process.env.TELEGRAM_TOKEN)
const rin = new Rin()

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    Rin.log.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.reply(Rin.defaultReply(rin.commandLists))
})

app.on('text', async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    const message = Rin.standarize(ctx.message.text)

    Rin.log.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): ${message}`)

    const response = await rin.handle(message)
    const result = await Rin.mdToHtml(response)

    if (result.length > 4000) {
        ctx.reply("Sorry It's too big to send")
    } else ctx.replyWithHTML(result)
})

app.catch(Rin.log.error)

app.startPolling()
