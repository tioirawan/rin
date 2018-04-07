import * as Helper from '../../src/core/helper'
import * as Commands from '../../src/commands'

import fs from 'fs'
import path from 'path'

describe('core.rin', () => {
    it('should correctly standarize a text', () => {
        const text = ' foo      bar BaZ bar    foo      '
        const standarized = Helper.standarize(text)

        expect(standarized).toBe('foo bar baz bar foo')
    })

    it('should correctly convert markdown to telegram html', () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/rin_mdtohtml.txt',
            'utf8'
        )

        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** ```foo bar(){return baz}``` `$ foo bar baz`'

        const html = Helper.mdToHtml(markdown)

        expect(html).toBe(expected)
    })

    it('should correctly strip markdown', () => {
        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** ```foo bar(){return baz}``` `$ foo bar baz`'

        const text = Helper.removeMarkdown(markdown)

        expect(text).toBe(
            'foo baz bar_foo baz*bar bar foo bar(){return baz} $ foo bar baz'
        )
    })

    it('should return max allowed text length', () => {
        expect(Helper.getMaxAllowedLength()).toBe(2000)
    })

    it('should correctly return all available commands', () => {
        expect(Helper.getAvailableCommand()).toEqual(Object.keys(Commands))
    })

    it('should correctly return default reply', () => {
        const data = [
            {
                command: 'eat',
                description: 'eat food'
            },
            {
                command: 'drink',
                description: 'drink water'
            }
        ]

        expect(Helper.defaultReply(data)).toBe(
            `**Hello! I am Rin, you can use the following command:**` +
                `\n\n\`eat\` - eat food\n\`drink\` - drink water\n\n` +
                `https://github.com/indmind/rin feel free to contribute!`
        )

        expect(Helper.defaultReply(data, true)).toBe(
            `**Hello! I am Rin, you can use the following command:**` +
                `\n\n\`\`\`eat   - eat food\ndrink - drink water\`\`\`\n\n` +
                `https://github.com/indmind/rin feel free to contribute!`
        )
    })

    it('should correctly get temp path', () => {
        expect(Helper.getTempPath('something')).toBe(
            path.resolve(__dirname + '../../../temp/something')
        )

        expect(Helper.getTempPath()).toBe(
            path.resolve(__dirname + '../../../temp')
        )
    })

    it('should return empty or not', () => {
        expect(Helper.isEmpty('')).toBe(true)
        expect(Helper.isEmpty('hello')).toBe(false)
        expect(Helper.notEmpty('')).toBe(false)
        expect(Helper.notEmpty('hello')).toBe(true)
    })

    it('should correctly make markdown code block', () => {
        const code = 'console.log("hello world!")'

        expect(Helper.code('js', code)).toBe('```js\n' + code + '\n```')
    })

    it('should correctly handle XOR', () => {
        expect(Helper.XOR(false, false)).toBe(false)
        expect(Helper.XOR(false, true)).toBe(true)
        expect(Helper.XOR(true, false)).toBe(true)
        expect(Helper.XOR(true, true)).toBe(false)
    })

    it('should correctly return file size', () => {
        expect(Helper.getFileSize(__dirname + '/../__data__/dummy.txt')).toBe(
            '365.84 KB'
        )
    })
})
