import Rin from '../core/rin'
import googl from 'goo.gl'

export default class Googl {
    constructor() {
        this.INFO = {
            command: 'googl',
            description: 'Create a shortened URL using https://goo.gl/',
            standarize: true,
            required: {
                value: process.env.GOOGL_API_KEY,
                toBe: Rin.notEmpty
            }
        }

        this.VARIABLE = {
            emptyURL: this.help
        }
    }

    async ready() {
        googl.setKey(process.env.GOOGL_API_KEY)
    }

    async handle(command) {
        const url = command[0]

        if (Rin.isEmpty(url)) return this.VARIABLE.emptyURL

        try {
            return await googl.shorten(url)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }

    get help() {
        const header = 'Wrong format!\n\n'
        const usage = 'usage: `googl <url>`'
        const params = 'Example:\n`rin googl example.com`'

        return header + usage + params
    }
}
