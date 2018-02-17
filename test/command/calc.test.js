import Calc from '../../src/commands/calc'

describe('command.calc', () => {
    const calc = new Calc()

    it('should return correct calculation', async () => {
        const addition = await calc.handle(['1 + 1'])
        const division = await calc.handle([' 628/ ', '   3'])
        const something = await calc.handle(['2e6 / 2', '+', '99 - 3e'])

        expect(addition).toEqual(expect.stringMatching(/2/))
        expect(division).toEqual(expect.stringMatching(/209.33333333333334/))
        expect(something).toEqual(expect.stringMatching(/1000090.845154514/))
    })
})
