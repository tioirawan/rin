import Rin from '../core/rin'
import jawaskrip from 'jawaskrip'

export default class Translate {
    constructor() {
        this.INFO = {
            command: 'jawaskrip',
            description: 'compile jawaskrip to javascript'
        }
        this.VARIABLE = {
            codeEmpty: 'empty code!'
        }
    }

    async handle(command) {
        const code = command.join(' ')

        if (Rin.isEmpty(code)) return this.VARIABLE.codeEmpty

        return await jawaskrip.compile(code)
    }
}
