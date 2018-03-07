if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load()
}

/* eslint-disable no-console */

if (process.env.STATUS == 'debug') {
    console.log('Running in cli interface')
    require('./vendor/cli')
} else if (process.env.HEROKU) {
    console.log('Runing on production server')
    require('./vendor/http')
}

if (process.env.DISCORD_TOKEN) {
    console.log('DISCORD token detected! include discord')
    require('./vendor/discord')
}

if (process.env.TELEGRAM_TOKEN) {
    console.log('TELEGRAM token detected! include telegram')
    require('./vendor/telegram')
}
