'use strict'

module.exports = function setupAgent (AgentModel) {
  async function createOrUpdate (agent) {
    const condicion = {
      where: { // objeto sequalize equivalente a un select
        uuid: agent.uuid
      }
    }
    const existingAgent = await AgentModel.findOne(condicion) // findone es una funcion de sequalize que devuelve el primer objeto encontrado

    if (existingAgent) {
      const update = await AgentModel.update(agent, condicion)
      return update ? AgentModel.findOne(condicion) : existingAgent
    }

    const result = await AgentModel.create(agent)
    return result.toJSON()
  }

  function findById (id) {
    return AgentModel.findById(id)
  }

  function findByUuid (uuid) {
    return AgentModel.findOne({
      where: {
        uuid
      }
    })
  }

  function findAll () {
    return AgentModel.findAll()
  }

  function findConnected () {
    return AgentModel.findAll({
      where: {
        connected: true
      }
    })
  }

  function findByUsername (username) {
    return AgentModel.findAll({
      where: {
        username,
        connected: true
      }
    })
  }

  return {
    createOrUpdate,
    findById,
    findByUuid,
    findAll,
    findConnected,
    findByUsername
  }
}
