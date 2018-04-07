import Telegraf, { Extra } from 'telegraf'
import express from 'express'
import path from 'path'

import Rin, {
    log,
    isEmpty,
    notEmpty,
    standarize,
    sendLogError,
    mdToHtml
} from '../core/rin'

const token = process.env.TELEGRAM_TOKEN
const url = process.env.URL || 'https://rincloud.herokuapp.com'
const port = process.env.PORT

const app = new Telegraf(token)
const rin = new Rin('telegram', app)

const expressApp = express()

rin.init()

if (process.env.HEROKU) {
    app.telegram.setWebhook(`${url}/bot${token}`)

    expressApp.use(app.webhookCallback(`/bot${token}`))
}

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username

    log.info(`Telegram logged as ${process.env.TELEGRAM_PREFIX} prefix`)
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    log.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.replyWithMarkdown(
        'Hello! I am Rin, to talk with me, just call my name, type `help` for available commands!' // Ignore LineLengthBear
    )
})

app.on('text', async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name
    const message = ctx.message.text.split(' ')

    const prefix = process.env.TELEGRAM_PREFIX

    if (notEmpty(prefix) && !(message[0].toLocaleLowerCase() === prefix)) {
        return
    }

    const chatInfo = `${userName}(${ctx.message.from.id}): ${standarize(
        message.join(' ')
    )}`

    log.info(`[TELEGRAM]${chatInfo}`)

    ctx.replyWithChatAction('typing')

    let response

    try {
        response = await rin.handle(
            isEmpty(prefix) ? message.join(' ') : message.slice(1).join(' '),
            { ctx }
        )

        response = notEmpty(response) ? response : 'Sorry, something went wrong'
    } catch (err) {
        LogError(err, chatInfo)
    }

    let result

    if (typeof response == 'object') {
        result = response.raw ? response.result : mdToHtml(response.result)
    } else {
        result = mdToHtml(response)
    }

    if (result.length > 4000) {
        ctx.reply(
            "Sorry It's too big to send",
            Extra.inReplyTo(ctx.message.message_id)
        )
    } else ctx.replyWithHTML(result, Extra.inReplyTo(ctx.message.message_id))
})

app.catch(LogError)

if (process.env.HEROKU) {
    expressApp.get('/', (req, res) => {
        log.info('Someone visiting web interface!')
        res.sendFile(path.resolve(__dirname, '../../view/index.html'))
    })

    expressApp.listen(port, () => log.info('Server running on port:', port))
} else {
    app.startPolling()
}

function LogError(err, chatInfo = '') {
    sendLogError(app, err, chatInfo)
}
