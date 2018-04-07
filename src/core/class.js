import * as Commands from '../commands'

import {
    log,
    isEmpty,
    removeMarkdown,
    defaultReply,
    standarize
} from './helper'

export default class Rin {
    constructor(vendor, client) {
        this.vendor = vendor
        this.client = client

        this.commands = Object.keys(Commands)
            .map(cmd => new Commands[cmd]())
            .filter(this.checkFor.bind(this))
            .filter(this.checkRequired)

        this.commandLists = this.commands.map(cmd => ({
            command: cmd.INFO.command,
            description: cmd.INFO.description
        }))
    }

    async init() {
        for (let cmd of this.commands) {
            'ready' in cmd ? await cmd.ready() : null
        }
    }

    checkFor(cmd) {
        const forVendor = cmd.INFO.for

        if (!forVendor) return true

        if (typeof forVendor === 'string') {
            return this.vendor === forVendor
        }

        return forVendor.includes(this.vendor)
    }

    checkRequired(cmd) {
        const required = cmd.INFO.required

        const check = required => {
            if (!required) return true
            if (!required.length) return true

            const completed = required.filter(req => {
                if (typeof req.toBe == 'function') {
                    return !req.toBe(req.value)
                }

                return !(req.value == req.toBe)
            })

            if (completed.length) return false

            return true
        }

        const checkResult = check(required)

        if (!checkResult) {
            log.warn(
                `${
                    cmd.INFO.command
                } command require something, and not passed, skip`
            )

            return false
        }

        return true
    }

    defaultReply(tidy) {
        return defaultReply(this.commandLists, tidy)
    }

    async handle(message, data = {}) {
        const argument = message.split(' ')
        const usrCmd = argument[0].toLowerCase()

        switch (usrCmd) {
            case 'chain':
                return await this.chainCommands(argument.slice(1))
            case 'help':
                return await this.defaultReply(this.vendor == 'discord')
        }

        const command = this.commands.find(
            cmd => usrCmd == cmd.INFO.command.toLowerCase()
        )

        if (!command) return await this.defaultReply(this.vendor == 'discord')

        if (!('handle' in command)) {
            return `${usrCmd} doesn't have handle method!`
        }

        Object.assign(data, {
            vendor: this.vendor,
            client: this.client
        })

        const input = argument.slice(1).join(' ')

        message = command.INFO.standarize ? standarize(input) : input

        return await command.handle(message.split(' '), data)
    }

    async chainCommands(message) {
        const input =
            message.indexOf('>') > 0
                ? message.slice(message.indexOf('>') + 1).join(' ')
                : ''

        const expressions = message
            .join(' ')
            .split('>')[0]
            .split(/\s*,\s*/)

        const availableCommand = this.commandLists.map(cmd =>
            cmd.command.toLowerCase()
        )

        if (isEmpty(expressions[0]) && isEmpty(input)) {
            const usage = 'usage: `chain cmd1, cmd2, cmd3`'
            const example =
                'example: `chain wiki, translate en id > search javascript`'

            return `${usage}\nfor long argument: \`chain cmd1, cmd2 > argument\`\n\n${example}`
        }

        for (let cmd of expressions) {
            const pureCommand = cmd.split(' ')[0]

            if (!availableCommand.includes(pureCommand)) {
                return `unknown command: ${pureCommand}`
            }
        }

        let error

        const result = await expressions.reduce(async (acc, cur) => {
            let res

            try {
                const accum = await acc
                const cmd = `${cur} ${removeMarkdown(accum.result || accum)}`

                res = await this.handle(cmd)
            } catch (err) {
                error = err
            }

            return res || acc
        }, Promise.resolve(input))

        if (error) return error.message || JSON.stringify(error)

        return result
    }
}
