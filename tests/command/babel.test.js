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
            `class Main{
                constructor(){
                    return this
                }

                static get handle(){
                    return this
                }
            }`
        ])

        const emptyRes = await babel.handle([``])

        expect(result).toBe(expected)
        expect(emptyRes).toBeTruthy()
    })

    it('should correctly handle the error', async () => {
        const test_1 = await babel.handle(['consts a = "10"'])
        const test_2 = await babel.handle(['[1,2,3].map(n => n + 1});'])

        expect(test_1).toBe('unknown: Unexpected token, expected ; (1:7)')
        expect(test_2).toBe('unknown: Unexpected token, expected , (1:22)')
    })
})
