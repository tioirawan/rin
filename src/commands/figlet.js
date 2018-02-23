import Rin from '../core/rin'
import figlet from 'figlet'

export default class Figlet {
    constructor() {
        this.INFO = {
            command: 'figlet',
            description: 'create a sort ASCII figlet banner (_experimental_)',
            standarize: false,
            for: ['discord', 'cli']
        }

        this.VARIABLE = {
            textEmpty: 'usage `figlet <some text>` ex `figlet Hello World!`'
        }
    }

    async handle(command) {
        const text = command.join(' ')

        if (Rin.isEmpty(text)) return this.VARIABLE.textEmpty

        try {
            const ascii = figlet.textSync(text)

            return Rin.code('', ascii)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }
}
