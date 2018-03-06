import Rin from '../core/rin'
import ud from 'urban-dictionary'

export default class Udict {
    constructor() {
        this.INFO = {
            command: 'udict',
            description: 'search urban dictionary',
            standarize: true
        }

        this.VARIABLE = {
            default: 'you can use `search`, `id` or `random` command',
            invalidDepth: 'invalid depth!',
            emptyTerm: 'empty term! usage `search <term> *<depth>`',
            termNotFound: "Hufft... I can't find anything",
            emptyID: 'empty id! usage `id <id>`',
            idNotFound: "It's a fake id!!!!!!",
            unknownError: 'Whoops... something error happened!'
        }
    }

    async handle(command) {
        switch (command[0]) {
            case 'search':
                return await this.searchTerm(command)
            case 'id':
                return await this.searchID(command)
            case 'random':
                return await this.getRandom()
            default:
                return this.VARIABLE.default
        }
    }

    async getRandom() {
        try {
            const result = await this.random()

            return this.compose(result)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }

    async searchID(command) {
        const id = command[1]

        if (Rin.isEmpty(id)) return this.VARIABLE.emptyID

        let response

        try {
            response = await this.id(id)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }

        return this.compose(response.entry)
    }

    async searchTerm(command) {
        const commandQuery = command.slice(1).join(' ')
        const fixedCommand = commandQuery.match(/[^" ]+|("[^"]*")/g) || ['']
        const term = fixedCommand[0].replace(/['"]+/g, '')

        if (Rin.isEmpty(term)) return this.VARIABLE.emptyTerm

        let response

        try {
            response = await this.term(term)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }

        const entriesLength = response.entries.length

        let entries = response.entries

        if (fixedCommand[1]) {
            let depth = parseInt(fixedCommand[1])

            if (isNaN(depth)) return this.VARIABLE.invalidDepth

            entries = entries.slice(0, depth)
        } else {
            entries = entries.slice(0, 1)
        }

        let result = `I found ${entriesLength} entries! Showing ${
            entries.length
        } entries...\n\n`

        result += entries.map(this.compose).join('\n')

        return result
    }

    compose(entry) {
        return `**${entry.word}**\n\n_${entry.definition}_\n\nExample:\n\`${
            entry.example
        }\`\n`
    }

    term(term) {
        return new Promise((resolve, reject) => {
            ud.term(term, (error, entries, tags, sounds) => {
                if (error) reject(this.VARIABLE.termNotFound)
                resolve({
                    entries,
                    tags,
                    sounds
                })
            })
        })
    }

    id(id) {
        return new Promise((resolve, reject) => {
            ud.defid(id, (error, entry, tags, sounds) => {
                if (error) reject(this.VARIABLE.idNotFound)
                resolve({
                    entry,
                    tags,
                    sounds
                })
            })
        })
    }

    random() {
        return new Promise((resolve, reject) => {
            ud.random((error, entry) => {
                if (error) reject(this.VARIABLE.unknownError)
                resolve(entry)
            })
        })
    }
}
