import Babel from '../../src/commands/babel'
import fs from 'fs'

describe('command.babel', () => {
    const babel = new Babel()

    it('should correctly compile Babel', async () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/babel.txt',
            'utf8'
        )
        const result = await babel.handle([
            `class Main{constructor(){return this}static get handle(){return this}}`
        ])

        expect(typeof result).toBe('string')
        expect(result).toBe(expected)
    })
})
