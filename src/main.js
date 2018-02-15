require(`./vendor/${process.env.STATUS == 'production' ? 'main' : 'cli'}`)
