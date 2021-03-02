import { Smallify, PluginOptions } from 'smallify'
import {
  ConnectOptions,
  SchemaOptions,
  SchemaTypeOptions,
  Schema,
  Connection,
  Model
} from 'mongoose'

export interface SmallifySchemaType {
  [key: string]: SchemaTypeOptions<undefined>
}

export interface SmallifyModel {
  name: string
  schema: SmallifySchemaType
  alias?: string
  options?: SchemaOptions
  class?: FunctionConstructor
  virtualize?: (schema: Schema) => void
}

export class SmallifyMongooseOptions extends PluginOptions {
  url: string
  mongoose: ConnectOptions
  models: Array<SmallifyModel>
}

export type SmallifyMongoosePlugin = {
  (smallify: Smallify, opts: SmallifyMongooseOptions): Promise<void>
}

export interface SmallifyMongoose {
  instance: Connection
  [key: string]: Model<any>
}
