'use strict'

const test = require('ava') //libreria para pruebas unitarias
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const agentFixtures = require('./fixtures/agent')//hace el llamado al datos falsos o quemados

let config = {
   logging: function() {}
}

let MetricStub = { //los stub simulan modelos, les pasan datos quemados para verificar que funcionan
    belongsTo: sinon.spy() //sinon es una funcion que da diferentes datos como por ejemplo ver cuantas veces se requirio el metodo
}

let id = 1
let single = Object.assign({}, agentFixtures.single) //clonamos el single para no estar probando solo con la instancia de fixtures, si no tener otra instancia por aparte 
let AgentStub = null
let sandbox = null
let db = null


test.beforeEach(async () => {
    sandbox = sinon.sandbox.create() //Cuando una funcion como agent es requerida muchas veces en varias partes del codigo los datos de cuantas veces se uso se acumulan y no funciona, se crea un sandbox para que esa estadistica se reinicie cada vez que se use
    AgentStub = {
        hasMany: sandbox.spy()
    }
    const setupDatabase = proxyquire('../',{
        './models/agent' : () => AgentStub,
        './models/metric' : () => MetricStub
    })
    db = await setupDatabase(config)
})

    test.afterEach(() => {
        sandbox && sandbox.restore()
    })

test('Agent', t => {
    t.truthy(db.Agent, 'Agent service should exist')
})
//El siguiente metodo es para hacer las pruebas de los stubs
test.serial('Setup', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed') //estas propiedades o estos mensajes me los entrega Sinon.spy
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be the MetricModel')     
    t.true(MetricStub.belongsTo.called, 'MetricModel.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be the AgentModel')
})

test.serial('Agent#findById', async t =>{
    let agent = await db.Agent.findById(id)

    t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})
