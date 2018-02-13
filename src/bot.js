import Discord from 'discord.js'
import logger from 'winston'

import Udict from './command/udict'
import Calc from './command/calc'

const env = process.env.NODE_ENV || 'development'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

const client = new Discord.Client()

const command = {
    udict: new Udict(),
    calc: new Calc()
}

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async ctx => {
    const message = ctx.content
    const args = message.split(' ')

    logger.info(`${ctx.author.username}(${ctx.author.id}): ${message}`)

    if (args[0] == client.user.username) {
        const cmd = args[1]
        const subcmd = args.slice(1)

        let result = ''

        if (Object.keys(command).includes(cmd)) {
            result = await command[cmd].handle(subcmd)
        } else {
            result = 'Hello!'
        }

        if (result.length > 2000) {
            ctx.reply("Sorry It's too big to send :disappointed:")
        } else ctx.reply(result)
    }
})

client.login(process.env.DISCORD_TOKEN)
