'use strict'

const agent = {
  id: 1,
  uuid: 'yyy-yyy-yyy',
  name: 'fixture',
  username: 'platzi',
  hostname: 'test-host',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const agents = [
  agent,
  extend(agent, {id: 2, uuid: 'yyy-yyy-yyw', connected: false, username: 'test'}),
  extend(agent, {id: 3, uuid: 'yyy-yyy-yyx'}),
  extend(agent, {id: 4, uuid: 'yyy-yyy-yyz', username: 'test'})
]

function extend (obj, values) { // funcion para clonar el objeto original con datos diferentes
  const clone = Object.assign({}, obj)
  return Object.assign(clone, values)
}

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected), // filtro para ver usuarios conectados
  platzi: agents.filter(a => a.username === 'platzi'), // filtro user = platzi
  byUuid: id => agents.filter(a => a.uuid === id).shift(), // filtro por uuid. Shift funciona para devolver el primer elemento encontrado, si no devolveria un array
  byId: id => agents.filter(a => a.id === id).shift()
}

/**
 * comandos para utilizar las pruebas
 * 1. node
 * 2. var agentFixture = require('./tests/fixtures/agent)
 * 3. agentFixture.single or .all or byId...
 */
