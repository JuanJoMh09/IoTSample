'use strict'

const db = require('../')

async function run() {
    const config = {
        database: process.env.DB_NAME || 'platziverse',
        username: process.env.DB_USER || 'juanjo',
        password: process.env.DB_PASS || 'jjmh',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
    }
    
    const {Agent, Metric} = await db(config).catch(handleFatalError)

    const agent = await Agent.createOrUpdate({
        uuid: 'sss',
        name: 'test',
        username: 'test',
        hostname: 'test',
        pid: 1,
        connected: false
    }).catch(handleFatalError)

    console.log('--agent--')
    console.log(agent)

    const agents = await Agent.findAll().catch(handleFatalError)
    console.log('--agents--')
    console.log(agents)

    const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
    console.log('--metrics--')
    console.log(metrics)

    const metric = await Metric.create(agent.uuid, {
        type:'memory',
        value: '310'
    }).catch(handleFatalError)

    console.log('--metric--')
    console.log(metric)

    const metricsByType = await Metric.findByTypeAgentUuid('memory', agent.uuid).catch(handleFatalError)
    console.log('--metrics--')
    console.log(metricsByType)
}

function handleFatalError(err){
    console.error(err.message)
    console.error(err.stack)
    process.exit(1)
}

run()