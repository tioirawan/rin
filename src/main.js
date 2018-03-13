if (process.env.NODE_ENV !== 'production') require('dotenv').load()

!(() => {
    if (process.env.STATUS == 'debug') {
        require('./vendor/cli')

        return
    }

    if (process.env.HEROKU) require('./vendor/http')
    if (process.env.DISCORD_TOKEN) require('./vendor/discord')
    if (process.env.TELEGRAM_TOKEN) require('./vendor/telegram')
})()
