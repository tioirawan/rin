import Rin, { log } from '../core/rin'

!(async () => {
    const argv = process.argv.slice(2).join(' ')
    const rin = new Rin('cli')

    await rin.init()

    log.info(await rin.handle(argv))
})()
