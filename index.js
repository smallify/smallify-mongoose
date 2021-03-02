const mongoose = require('mongoose')

const defaults = {
  mongoose: {},
  models: []
}

function fixSchemaType (schema) {
  Object.keys(schema).forEach(key => {
    if (schema[key].type === 'ObjectId') {
      schema[key].type = mongoose.Schema.Types.ObjectId
    } else if (schema[key].length !== undefined) {
      schema[key].forEach(member => {
        if (member.type === 'ObjectId') {
          member.type = mongoose.Schema.Types.ObjectId
        }
      })
    }
  })
}

module.exports = async function (smallify, opts) {
  const options = { ...defaults, ...opts }
  const { url, mongoose: mOptions, models: mModels = [] } = options

  await mongoose.connect(url, mOptions)

  smallify.addHook('onClose', function () {
    return new Promise(resolve => {
      mongoose.connection.on('close', resolve)
      mongoose.connection.close()
    })
  })

  const decorator = {
    instance: mongoose
  }

  const decorateName = 'mongoose'
  if (!smallify.hasDecorator(decorateName)) {
    smallify.decorate(decorateName, decorator)
  }

  for (const model of mModels) {
    if (!model.alias) {
      model.alias = `${model.name[0].toUpperCase()}${model.name.slice(1)}`
    }

    fixSchemaType(model.schema)

    const schema = new mongoose.Schema(model.schema, model.options)

    if (model.class) {
      schema.loadClass(model.class)
    }

    if (model.virtualize) {
      model.virtualize(schema)
    }

    decorator[model.alias] = mongoose.model(model.alias, schema, model.name)
  }
}
