import Calc from '../../src/command/calc'

describe('command.calc', () => {
    const calc = new Calc()

    it('should return correct calculation', () => {
        const addition = calc.handle(['calc', '1 + 1'])
        const division = calc.handle(['calc', ' 628/ 3'])
        const something = calc.handle(['calc', '2e6 / 2 + 99 - 3e'])

        expect(addition).toEqual(expect.stringMatching(/2/))
        expect(division).toEqual(expect.stringMatching(/209.33333333333334/))
        expect(something).toEqual(expect.stringMatching(/1000090.845154514/))
    })
})
