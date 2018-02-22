import Discord from 'discord.js'

import Rin from '../core/rin'

const client = new Discord.Client()
const rin = new Rin()

client.on('ready', () => {
    Rin.log.info(`Logged in as ${client.user.tag}!`)

    client.user.setPresence({
        status: 'online',
        game: { name: 'Half Lie' }
    })
})

client.on('message', async ctx => {
    const message = ctx.content
    const args = message.split(' ')
    const username = ctx.author.username

    if (!(args[0] == client.user.username)) return

    ctx.channel.startTyping()

    Rin.log.info(
        `[DISCORD]${username}(${ctx.author.id}): ${Rin.standarize(message)}`
    )

    const subcmd = args.slice(1).join(' ')

    const result = await rin.handle(subcmd, { vendor: 'discord' })

    ctx.channel.stopTyping(true)

    if (result.length > 2000) {
        ctx.reply("Sorry It's too big to send :disappointed:")
    } else ctx.reply(result)
})

client.login(process.env.DISCORD_TOKEN)
