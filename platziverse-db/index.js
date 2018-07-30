'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const setupAgent = require('./lib/agent')
const setupMetic = require('./lib/metric')
const defaults = require('defaults') // modulo

module.exports = async function (config) {
  config = defaults(config, { // Agarrar datos del primer paramentro "config", si no esta definida agarrar las de segundo parametro, es para hacer pruebas
    dialect: 'sqlite',
    pool: { // pool de coneciones para performance
      max: 10,
      min: 0,
      idle: 10000 // cantidad de tiempo inactivo que puede estar un usuario conectado a la base
    },
    query: {// Usualmente squalize entra objetos completos, con este parametro configuramos que nos devuela objetos json
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true})
  }

  const Agent = setupAgent(AgentModel)
  const Metric = setupMetic(MetricModel, AgentModel)

  return {
    Agent,
    Metric
  }
}
