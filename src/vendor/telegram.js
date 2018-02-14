import Telegraf from 'telegraf'
import logger from 'winston'

import Udict from '../command/udict'
import Calc from '../command/calc'
import Wiki from '../command/wiki'

const pack = require(__dirname + '/../../package.json')

const env = process.env.NODE_ENV || 'development'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

const app = new Telegraf(process.env.TOKEN)

const command = {
    udict: new Udict(),
    calc: new Calc(),
    wiki: new Wiki()
}

app.command('start', async ctx => {
    ctx.reply('Hello! I am rin')
})

app.on('text', async ctx => {
    const userName = ctx.message.from.first_name + ctx.message.from.last_name
    const message = ctx.message.text

    const args = message.split(' ')

    if (args[0] == pack.name) {
        logger.info(`${userName}(${ctx.message.from.id}): ${message}`)

        const cmd = args[1]
        const subcmd = args.slice(1)
        const cmdLists = Object.keys(command)

        let result = ''

        if (cmdLists.includes(cmd)) {
            const response = await command[cmd].handle(subcmd)
            result = response.replace(/\s*:.*?:\s*/g, '')
        } else {
            const cmdListString = cmdLists.map(cmd => `\`${cmd}\``).join('\n')
            result = `Hello! you can use the following command:\n${cmdListString}`
        }

        if (result.length > 4000) {
            ctx.reply("Sorry It's too big to send")
        } else ctx.replyWithMarkdown(result)
    }
})

app.catch(err => {
    logger.error('Ooops ')
    logger.error(err)
})

app.startPolling()
