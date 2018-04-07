import figlet from 'figlet'

import { isEmpty, code } from '../core/rin'

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

        if (isEmpty(text)) return this.VARIABLE.textEmpty

        try {
            const ascii = figlet.textSync(text)

            return code('', ascii)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }
}
