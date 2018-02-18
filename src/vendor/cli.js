import Rin from '../core/rin'

!(async () => {
    const argv = process.argv.slice(2).join(' ')
    const rin = new Rin()

    Rin.log.info(await rin.handle(argv))
})()
