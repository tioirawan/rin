import logger from 'winston'

if (process.env.STATUS == 'debug') {
    logger.info('Running in cli interface')
    require('./vendor/cli')
} else if (process.env.HEROKU) {
    logger.info('Runing on production server')
    require('./vendor/http')
}

if (process.env.DISCORD_TOKEN) {
    logger.info('DISCORD token detected! include discord')
    require('./vendor/discord')
}

if (process.env.TELEGRAM_TOKEN) {
    logger.info('TELEGRAM token detected! include telegram')
    require('./vendor/telegram')
}
