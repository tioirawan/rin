import Telegraf, { Extra } from 'telegraf'

import Rin from '../core/rin'

const token = process.env.TELEGRAM_TOKEN

const app = new Telegraf(token)
const rin = new Rin('telegram', app)

rin.init()

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username

    Rin.log.info(`Telegram logged as ${process.env.TELEGRAM_PREFIX} prefix`)
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    Rin.log.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.replyWithMarkdown(
        'Hello! I am Rin, to talk with me, just call my name, type `help` for available commands!' // Ignore LineLengthBear
    )
})

app.on('text', async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name
    const message = ctx.message.text.split(' ')

    const prefix = process.env.TELEGRAM_PREFIX

    if (Rin.isEmpty(prefix)) throw new Error('Set TELEGRAM_PREFIX in .env')

    if (!(message[0].toLocaleLowerCase() === prefix)) return

    const chatInfo = `${userName}(${ctx.message.from.id}): ${Rin.standarize(
        message.join(' ')
    )}`

    Rin.log.info(`[TELEGRAM]${chatInfo}`)

    ctx.replyWithChatAction('typing')

    let response

    try {
        response = await rin.handle(message.slice(1).join(' '), { ctx })
    } catch (err) {
        sendLogError(err, chatInfo)
    }

    if (!response) return

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

app.catch(sendLogError)

if (process.env.HEROKU) {
    const url = process.env.URL || 'https://rincloud.herokuapp.com'

    app.telegram.setWebhook(`${url}/bot${token}`)
    app.startWebhook(`/bot${token}`, null, process.env.PORT)
} else {
    app.startPolling()
}

function sendLogError(err, chatInfo = '') {
    Rin.sendLogError(app, err, chatInfo)
}
