'use strict'

module.exports = function setupMetric (MetricModel, AgentModel) {
  async function findByAgentUuid (uuid) { // Ver metricas por UUID
    return MetricModel.findAll({
      attributes: ['type'],
      group: ['type'],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  async function findByTypeAgentUuid(type, uuid){//bucar por tipo de metrica y por id de agente
    return MetricModel.findAll({
        attributes: ['id', 'type','value','createdAt'],
        where: {
            type
        },
        limit: 20,
        order: [['createdAt', 'DESC']],
        include: [{
            attributes:[],
            model: AgentModel,
            where: {
                uuid
            }
        }],
        raw: true
    })
  }
  async function create (uuid, metric) {
    const agent = await AgentModel.findOne({
      where: {uuid}
    })

    if (agent) {
      Object.assign(metric, {agentId: agent.id})
      const result = await MetricModel.create(metric)
      return result.toJSON()
    }
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}
