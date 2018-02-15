import Discord from 'discord.js'
import Telegraf from 'telegraf'
import logger from 'winston'

import Udict from '../command/udict'
import Calc from '../command/calc'
import Wiki from '../command/wiki'

import Rin from '../core/rin'

const env = process.env.NODE_ENV || 'development'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

const client = new Discord.Client()

const command = {
    udict: new Udict(),
    calc: new Calc(),
    wiki: new Wiki()
}

const cmdLists = Object.keys(command)
const cmdListString = cmdLists.map(cmd => `\`${cmd}\``).join('\n')
const defaultReply = `Hello! I am Rin an open source multi-purpose bot https://github.com/indmind/rin feel free to contribute!\n you can use the following command:\n${cmdListString}`

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async ctx => {
    const message = ctx.content
    const args = message.split(' ')

    if (args[0] == client.user.username) {
        logger.info(
            `[DISCORD]${ctx.author.username}(${ctx.author.id}): ${message}`
        )

        const cmd = args[1]
        const subcmd = args.slice(1)

        let result = ''

        if (cmdLists.includes(cmd)) {
            result = await command[cmd].handle(subcmd)
        } else {
            result = defaultReply
        }

        if (result.length > 2000) {
            ctx.reply("Sorry It's too big to send :disappointed:")
        } else ctx.reply(result)
    }
})

client.login(process.env.DISCORD_TOKEN)

const app = new Telegraf(process.env.TELEGRAM_TOKEN)
const rin = new Rin()

app.telegram.getMe().then(botInfo => {
    app.options.username = botInfo.username
})

app.start(async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name

    logger.info(`[TELEGRAM]${userName}(${ctx.message.from.id}): /start`)

    ctx.reply(defaultReply)
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
        result = rin.telegramize(response)
    } else {
        result = defaultReply
    }

    if (result.length > 4000) {
        ctx.reply("Sorry It's too big to send")
    } else ctx.replyWithMarkdown(result)
})

app.catch(err => {
    logger.error('Ooops ')
    logger.error(err)
})

app.startPolling()
