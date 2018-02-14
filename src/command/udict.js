import ud from 'urban-dictionary'

export default class Udict {
    async handle(command) {
        switch (command[1]) {
            case 'search':
                return await this.searchTerm(command)
            case 'id':
                return await this.searchID(command[2])
            case 'random':
                try {
                    return this.compose(await this.random())
                } catch (err) {
                    return err
                }
            default:
                return ':confused: what do you want? you can use `search` `id` or `random` command'
        }
    }

    async searchID(id) {
        let response

        try {
            response = await this.id(id)
        } catch (err) {
            return err
        }

        return this.compose(response.entry)
    }

    async searchTerm(command) {
        const commandQuery = command.slice(2).join(' ')
        const fixedCommand = commandQuery.match(/[^" ]+|("[^"]*")/g) || ['']

        let response

        try {
            response = await this.term(fixedCommand[0].replace(/['"]+/g, ''))
        } catch (err) {
            return err
        }

        const entriesLength = response.entries.length

        let entries = response.entries

        if (fixedCommand[1]) {
            let depth = parseInt(fixedCommand[1])

            if (isNaN(depth)) return 'invalid depth!'

            entries = entries.slice(0, depth)
        } else {
            entries = entries.slice(0, 1)
        }

        let result = `I found ${entriesLength} entries! Showing ${
            entries.length
        } entries...\n\n`

        result += entries
            .map((entry, index) => `${index + 1}. ${this.compose(entry)}`)
            .join('\n')

        return result
    }

    compose(entry) {
        return `**${entry.word}**\n\n_${entry.definition}_\n\nExample:\n\`${
            entry.example
        }\`\n`
    }

    term(term) {
        return new Promise((resolve, reject) => {
            if (!term) reject('empty term! usage `search <term> *<depth>`')

            ud.term(term, (error, entries, tags, sounds) => {
                if (error) reject("Hufft... I can't find anything :pensive:")
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
            if (!id) reject('empty id! usage `id <id>`')

            ud.defid(id, (error, entry, tags, sounds) => {
                if (error) reject("It's a fake id!!!!!! :angry::angry:")
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
                if (error) reject('Whoops... something error happened!')
                resolve(entry)
            })
        })
    }
}
