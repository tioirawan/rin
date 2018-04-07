import Urban from '../../src/commands/urban'
import fs from 'fs'
import path from 'path'

jest.setTimeout(10000)

describe('command.urban', () => {
    const urban = new Urban()

    it('should return correct data from search command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/urban_search_plain.txt'),
            'utf8'
        )
        const result = await urban.handle(['search', 'm8'])
        const emptySearch = await urban.handle(['search'])
        const notFound = await urban.handle(['search', 'dasfiluayihdsiufsswdd'])

        expect(result).toEqual(expectedResult)
        expect(emptySearch).toBe(urban.VARIABLE.emptyTerm)
        expect(notFound).toBe(urban.VARIABLE.termNotFound)
    })

    it('should return correct data from search command with depth', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/urban_search_depth.txt'),
            'utf8'
        )
        const result = await urban.handle(['search', 'm8', '4'])
        const invalidDepth = await urban.handle(['search', 'm8', 'many'])

        expect(result).toEqual(expectedResult)
        expect(invalidDepth).toEqual(urban.VARIABLE.invalidDepth)
    })

    it('should return correct data from id command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/urban_id.txt'),
            'utf8'
        )
        const result = await urban.handle(['id', '2488552'])
        const emptyID = await urban.handle(['id'])
        const notFound = await urban.handle(['id', '9876543212345678987654321'])

        expect(result).toEqual(expectedResult)
        expect(emptyID).toBe(urban.VARIABLE.emptyID)
        expect(notFound).toBe(urban.VARIABLE.idNotFound)
    })

    it('should return random data from random command', async () => {
        const result = await urban.handle(['random'])

        expect(result).toBeDefined()
    })

    it('should return default message', async () => {
        const empty = await urban.handle([''])
        const unknown = await urban.handle(['blabla'])

        expect(empty).toBe(urban.VARIABLE.default)
        expect(unknown).toBe(urban.VARIABLE.default)
    })
})
