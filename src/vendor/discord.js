import Discord from 'discord.js'
import logger from 'winston'

import Rin from '../core/rin'

const env = process.env.NODE_ENV || 'development'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

const client = new Discord.Client()

const command = Rin.command
const cmdLists = Rin.cmdLists

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async ctx => {
    const message = Rin.standarize(ctx.content)

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
            result = Rin.defaultReply
        }

        if (result.length > 2000) {
            ctx.reply("Sorry It's too big to send :disappointed:")
        } else ctx.reply(result)
    }
})

client.login(process.env.DISCORD_TOKEN)
