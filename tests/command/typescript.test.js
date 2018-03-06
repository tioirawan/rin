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
})
