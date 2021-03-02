import { Smallify } from 'smallify'
import {
  SmallifyMongoosePlugin,
  SmallifyMongooseOptions,
  SmallifyMongoose
} from './types/options'

declare const mongoose: SmallifyMongoosePlugin

export = mongoose

declare module 'smallify' {
  interface SmallifyPlugin {
    (plugin: SmallifyMongoosePlugin, opts: SmallifyMongooseOptions): Smallify
  }

  interface Smallify {
    mongoose: SmallifyMongoose
  }
}
