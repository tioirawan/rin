import Discord from 'discord.js'
import logger from 'winston'

import Udict from './command/udict'
import Calc from './command/calc'
import Wiki from './command/wiki'

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

client.on('ready', () => {
    logger.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async ctx => {
    const message = ctx.content
    const args = message.split(' ')

    if (args[0] == client.user.username) {
        logger.info(`${ctx.author.username}(${ctx.author.id}): ${message}`)

        const cmd = args[1]
        const subcmd = args.slice(1)
        const cmdLists = Object.keys(command)

        let result = ''

        if (cmdLists.includes(cmd)) {
            result = await command[cmd].handle(subcmd)
        } else {
            const cmdListString = cmdLists.map(cmd => `\`${cmd}\``).join('\n')
            result = `Hello! you can use the following command:\n${cmdListString}`
        }

        if (result.length > 2000) {
            ctx.reply("Sorry It's too big to send :disappointed:")
        } else ctx.reply(result)
    }
})

client.login(process.env.DISCORD_TOKEN)
