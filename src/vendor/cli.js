import Rin from '../core/rin'

!(async () => {
    const argv = process.argv.slice(2).join(' ')
    const rin = new Rin('cli')

    await rin.init()

    Rin.log.info(await rin.handle(argv))
})()
