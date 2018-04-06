import Scss from '../../src/commands/scss'
import fs from 'fs'

describe('command.scss', () => {
    const scss = new Scss()

    it('should correctly compile Scss', async () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/scss.txt',
            'utf8'
        )
        const result = await scss.handle([
            `@mixin dialog-box($border-color: gray) {
                border: 10px solid $border-color;
                padding: 10px;
                box-shadow: 0 0 30px rgba(0,0,0,0.5);
              }

              .alert-winning-user {
                @include dialog-box;
              }`
        ])

        expect(typeof result).toBe('string')
        expect(result).toBe(expected)
    })

    it('should correctly handle the error', async () => {
        const emptyTest = await scss.handle([''])
        const errorTest = await scss.handle([
            `
            $primary-color: #333;
            body {
                color: $primary-colors;
            }
            `
        ])

        expect(emptyTest).toBe(scss.VARIABLE.codeEmpty)
        expect(errorTest).toBe('Undefined variable: "$primary-colors".')
    })
})
