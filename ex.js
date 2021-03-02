const Smallify = require('smallify')
const smallifyMongoose = require('./index')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify.register(smallifyMongoose, {
  url: '',
  models: [
    {
      name: 'post',
      schema: {
        title: {
          type: String,
          required: true
        },
        content: {
          type: String,
          required: true
        },
        author: {
          type: 'ObjectId',
          ref: 'Account'
        }
      }
    },
    {
      name: 'account',
      schema: {
        username: {
          type: String
        },
        password: {
          type: String,
          select: false,
          required: true
        }
      },
      virtualize: schema => {
        schema.virtual('posts', {
          ref: 'Post',
          localKey: '_id',
          foreignKey: 'author'
        })
      }
    }
  ],
  mongoose: {
    autoIndex: true
  }
})

smallify.ready(err => {
  err && smallify.$log.error(err.message)
  smallify.print()
})
