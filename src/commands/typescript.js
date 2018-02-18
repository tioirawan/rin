import Rin from '../core/rin'
import tsc from 'typescript-compiler'

export default class Typescript {
    constructor() {
        this.INFO = {
            command: 'typescript',
            description: 'compile typescript to javascript'
        }
        this.VARIABLE = {
            codeEmpty: 'empty code!',
            unknownEror: 'sorry, an unknown error occurred'
        }
    }

    async handle(command) {
        const ts = command.join(' ')

        if (Rin.isEmpty(ts)) return this.VARIABLE.codeEmpty

        try {
            const result = tsc.compileString(ts, '--target ES6', null, e => {
                if (e) throw e.formattedMessage
            })

            if (Rin.isEmpty(result)) return this.VARIABLE.unknownEror

            return result
        } catch (err) {
            return err.message || err
        }
    }
}
