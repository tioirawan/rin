import Jawaskrip from '../../src/commands/jawaskrip'
import fs from 'fs'

describe('command.jw', () => {
    const jw = new Jawaskrip()

    it('should correctly compile jawaskrip', async () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/jawaskrip.txt',
            'utf8'
        )
        const result = await jw.handle([
            `fungsi makan(makanan){
                tulis("makan " + "makanan");
                kembalikan "selesai!"
            }`
        ])

        expect(typeof result).toBe('string')
        expect(result).toBe(expected)
    })

    it('should correctly handle the error', async () => {
        const emptyTest = await jw.handle([''])
        const errorTest = await jw.handle(['var something = "i love this'])

        expect(emptyTest).toBe(jw.VARIABLE.codeEmpty)
        expect(errorTest).toBe('Error: (1):\nTanda Kutip Tidak Terselesaikan')
    })
})
