import logger from 'winston'

import Udict from '../command/udict'
import Calc from '../command/calc'
import Wiki from '../command/wiki'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = 'debug'

!(async () => {
    const command = {
        udict: new Udict(),
        calc: new Calc(),
        wiki: new Wiki()
    }

    const cmdList = Object.keys(command)

    const argv = process.argv.slice(2)

    if (cmdList.includes(argv[0])) {
        try {
            logger.info(await command[argv[0]].handle(argv))
        } catch (error) {
            logger.error(error.message)
        }
    } else {
        logger.info(
            `command not found, you can use the following command: ${cmdList}`
        )
    }
})()
