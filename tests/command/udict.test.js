import Udict from '../../src/commands/udict'
import fs from 'fs'
import path from 'path'

jest.setTimeout(10000)

describe('command.udict', () => {
    const udict = new Udict()

    it('should return correct data from search command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/udict_search_plain.txt'),
            'utf8'
        )
        const result = await udict.handle(['search', 'm8'])

        expect(result).toEqual(expectedResult)
    })

    it('should return correct data from search command with depth', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/udict_search_depth.txt'),
            'utf8'
        )
        const result = await udict.handle(['search', 'm8', '4'])

        expect(result).toEqual(expectedResult)
    })

    it('should return correct data from id command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/udict_id.txt'),
            'utf8'
        )
        const result = await udict.handle(['id', '2488552'])

        expect(result).toEqual(expectedResult)
    })

    it('should return random data from random command', async () => {
        const result = await udict.handle(['random'])

        expect(result).toBeDefined()
    })
})
