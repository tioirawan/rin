import Rin from '../../src/core/class'
import { defaultReply } from '../../src/core/helper'

import * as Commands from '../../src/commands'

const vendor = 'test'
const client = 'something'

const rin = new Rin(vendor, client)

describe('core.class', () => {
    let commands, commandLists

    it('should have all required method', () => {
        expect(rin.init).toBeInstanceOf(Function)
        expect(rin.checkFor).toBeInstanceOf(Function)
        expect(rin.checkRequired).toBeInstanceOf(Function)
        expect(rin.defaultReply).toBeInstanceOf(Function)
        expect(rin.handle).toBeInstanceOf(Function)
        expect(rin.chainCommands).toBeInstanceOf(Function)
    })

    it('should successfully call init method', async () => {
        await rin.init() // idk what to test here
    })

    it('should have vendor and client variable', () => {
        expect(rin.vendor).toBe(vendor)
        expect(rin.client).toBe(client)
    })

    it('should have correct commands variable', () => {
        commands = Object.keys(Commands)
            .map(cmd => new Commands[cmd]())
            .filter(rin.checkFor.bind(rin))
            .filter(rin.checkRequired)

        expect(rin.commands).toEqual(commands)
    })

    it('should have correct command list', () => {
        commandLists = commands.map(cmd => ({
            command: cmd.INFO.command,
            description: cmd.INFO.description
        }))

        expect(rin.commandLists).toEqual(commandLists)
    })

    it('should correctly return default reply', () => {
        expect(rin.defaultReply()).toBe(defaultReply(commandLists))
        expect(rin.defaultReply(true)).toBe(defaultReply(commandLists, true))
    })

    it('should correctly handle input command', async () => {
        const result = await rin.handle('calc 1 + 1')

        expect(result).toMatch(/2/)
    })

    it('should correctly handle chain command', async () => {
        const result = await rin.handle('chain wiki, translate en id > random')

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
    })

    it('should correctly handle empty chain command', async () => {
        const result = await rin.handle('chain')

        const usage = 'usage: `chain cmd1, cmd2, cmd3`'
        const example =
            'example: `chain wiki, translate en id > search javascript`'

        expect(result).toBe(
            `${usage}\nfor long argument: \`chain cmd1, cmd2 > argument\`\n\n${example}`
        )
    })

    it('should correctly handle unknown chain command', async () => {
        const result = await rin.handle('chain is, crispy > rendang')

        expect(result).toMatch(/unknown command: is/)
    })

    it('should return default reply on help command', async () => {
        const result = await rin.handle('help')

        expect(result).toBe(rin.defaultReply())
    })
})
