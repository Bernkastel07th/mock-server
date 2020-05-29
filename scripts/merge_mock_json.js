const fs = require('fs')
const path = require('path')
const root = path.resolve('./', 'mock-server/api')

const writeMockJSON = () => {
  const api = fs.readdirSync(root).reduce((api, file) => {
    if (api === undefined) api = {}

    if (path.extname(file) === '.json') {
      const endpoint = path.basename(file, path.extname(file))

      if (api[endpoint] === undefined) api[endpoint] = {}

      api[endpoint] = JSON.parse(fs.readFileSync(root + '/' + file, 'utf-8'))

      return api
    }
  }, {})

  fs.writeFileSync('./mock-server/db.json', JSON.stringify(api), err => {
    if (err) throw err
  })
}

const mergeMockJson = () => {
  fs.watch(root, () => {
    writeMockJSON()
  })

  writeMockJSON()
}

module.exports = mergeMockJson
