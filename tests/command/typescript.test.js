import Typescript from '../../src/commands/typescript'
import fs from 'fs'

describe('command.typescript', () => {
    const typescript = new Typescript()

    it('should correctly compile Typescript', async () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/typescript.txt',
            'utf8'
        )
        const result = await typescript.handle([
            `declare class Greeter {
                constructor(greeting: string);

                greeting: string;
                showGreeting(): void;
            }

            const myGreeter = new Greeter("hello, world");
            myGreeter.greeting = "howdy";
            myGreeter.showGreeting();

            class SpecialGreeter extends Greeter {
                constructor() {
                    super("Very special greetings");
                }
            }`
        ])

        expect(typeof result).toBe('string')
        expect(result).toBe(expected)
    })

    it('should correctly handle error', async () => {
        const emptyCode = await typescript.handle([''])
        const error = await typescript.handle(['const age : number = "16"'])

        expect(emptyCode).toBe(typescript.VARIABLE.codeEmpty)
        expect(error).toBe(
            `string.ts(1,7): error TS2322: ` +
                `Type 'string' is not assignable to type 'number'.\n`
        )
    })
})
