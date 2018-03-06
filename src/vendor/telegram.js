import Telegraf, { Extra } from 'telegraf'

import Rin from '../core/rin'

const app = new Telegraf(process.env.TELEGRAM_TOKEN)
const rin = new Rin('telegram')

rin.init()

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    Rin.log.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.replyWithMarkdown(
        'Hello! I am Rin, to talk with me, just reply my message, type `help` for available commands!' // Ignore LineLengthBear
    )
})

app.on('text', async ctx => {
    app.telegram.sendChatAction(ctx.from.id, 'typing')

    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    const message = ctx.message.text

    Rin.log.info(
        `[TELEGRAM]${userName}(${ctx.message.from.id}): ${Rin.standarize(
            message
        )}`
    )

    const response = await rin.handle(message, { ctx })

    let result

    if (typeof response == 'object') {
        result = response.raw ? response.result : Rin.mdToHtml(response.result)
    } else {
        result = Rin.mdToHtml(response)
    }

    if (result.length > 4000) {
        ctx.reply(
            "Sorry It's too big to send",
            Extra.inReplyTo(ctx.message.message_id)
        )
    } else ctx.replyWithHTML(result, Extra.inReplyTo(ctx.message.message_id))
})

app.catch(Rin.log.error)

app.startPolling()
