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
        const emptySearch = await udict.handle(['search'])
        const notFound = await udict.handle(['search', 'dasfiluayihdsiufsswdd'])

        expect(result).toEqual(expectedResult)
        expect(emptySearch).toBe(udict.VARIABLE.emptyTerm)
        expect(notFound).toBe(udict.VARIABLE.termNotFound)
    })

    it('should return correct data from search command with depth', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/udict_search_depth.txt'),
            'utf8'
        )
        const result = await udict.handle(['search', 'm8', '4'])
        const invalidDepth = await udict.handle(['search', 'm8', 'many'])

        expect(result).toEqual(expectedResult)
        expect(invalidDepth).toEqual(udict.VARIABLE.invalidDepth)
    })

    it('should return correct data from id command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/udict_id.txt'),
            'utf8'
        )
        const result = await udict.handle(['id', '2488552'])
        const emptyID = await udict.handle(['id'])
        const notFound = await udict.handle(['id', '9876543212345678987654321'])

        expect(result).toEqual(expectedResult)
        expect(emptyID).toBe(udict.VARIABLE.emptyID)
        expect(notFound).toBe(udict.VARIABLE.idNotFound)
    })

    it('should return random data from random command', async () => {
        const result = await udict.handle(['random'])

        expect(result).toBeDefined()
    })

    it('should return default message', async () => {
        const empty = await udict.handle([''])
        const unknown = await udict.handle(['blabla'])

        expect(empty).toBe(udict.VARIABLE.default)
        expect(unknown).toBe(udict.VARIABLE.default)
    })
})
