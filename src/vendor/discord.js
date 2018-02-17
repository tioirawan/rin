import Discord from 'discord.js'

import Rin from '../core/rin'

const client = new Discord.Client()
const rin = new Rin()

client.on('ready', () => {
    Rin.log.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async ctx => {
    const message = Rin.standarize(ctx.content)
    const args = message.split(' ')

    if (args[0] == client.user.username) {
        Rin.log.info(
            `[DISCORD]${ctx.author.username}(${ctx.author.id}): ${message}`
        )

        const subcmd = args.slice(1)

        const result = await rin.handle(subcmd)

        if (result.length > 2000) {
            ctx.reply("Sorry It's too big to send :disappointed:")
        } else ctx.reply(result)
    }
})

client.login(process.env.DISCORD_TOKEN)
