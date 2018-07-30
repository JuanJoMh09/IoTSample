'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')// modulo para mensajes en consola
const chalk = require('chalk') // modulo para dar color a los textos, con la funcion template de EM6
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {

  if (process.argv[2] !== '--yes') {
    const answer = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy your datebase, are you sure?'
      }
    ])

    if (!answer.setup) {
      return console.log('Nothing happened :)')
    } 
  }
  
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DN_USER || 'juanjo',
    password: process.env.DB_PASS || 'jjmh',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
