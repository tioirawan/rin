import Rin from '../core/rin'
import { transform } from 'babel-core'
import preset from 'babel-preset-env'

export default class Translate {
    constructor() {
        this.INFO = {
            command: 'babel',
            description: 'compile es6 to es5 using babel'
        }
        this.VARIABLE = {
            codeEmpty: 'empty code!'
        }
    }

    async handle(command) {
        const es6 = command.join(' ')

        if (Rin.isEmpty(es6)) return this.VARIABLE.codeEmpty

        try {
            const { code } = transform(es6, {
                presets: [preset],
                babelrc: false
            })

            return code
        } catch (err) {
            return err.message
        }
    }
}
