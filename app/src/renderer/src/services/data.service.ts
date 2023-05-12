import { JsonConvert } from "json2typescript"
import { Customer } from "../models/customer.model"
import { INVOICING_API } from "$lib/configuration"

export interface ApiResult<T> {
  status: number
  error: unknown
  result: T | null
}

export class DataService {
  private static _instance: DataService
  //Assign "new Singleton()" here to avoid lazy initialisation

  constructor() {
    if (DataService._instance) {
      throw new Error("Error - use Singleton.getInstance()")
    }
    this.converter = new JsonConvert()
    this.converter.registerClasses(Customer)
  }

  static instance(): DataService {
    DataService._instance = DataService._instance || new DataService()
    return DataService._instance
  }

  private converter: JsonConvert

  async get<T extends object>(
    endpoint: string,
    classReference: { new (): T }
  ): Promise<ApiResult<T>> {
    const response = await fetch(`${INVOICING_API}${endpoint}`)
    if (response.ok) {
      const jsonObj = await response.json()
      const obj = this.converter.deserializeObject<T>(jsonObj, classReference)

      return {
        status: response.status,
        error: null,
        result: obj
      }
    }
    return {
      status: response.status,
      error: response.text(),
      result: null
    }
  }

  async post<T extends object>(
    endpoint: string,
    obj: T,
    classReference: { new (): T }
  ): Promise<boolean> {
    const jsonObj = this.converter.serializeObject<T>(obj, classReference)

    const response = await fetch(`${INVOICING_API}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(jsonObj),
      headers: {
        'content-type': 'application/json'
      }
    })

    return response.ok
  }

  async delete(
    endpoint: string,
  ): Promise<boolean> {
    const response = await fetch(`${INVOICING_API}${endpoint}`, {
      method: "DELETE",
    })
    return response.ok
  }

  async getList<T extends object>(
    endpoint: string,
    classReference: { new (): T }
  ): Promise<ApiResult<T[]>> {
    const response = await fetch(`${INVOICING_API}${endpoint}`)
    if (response.ok) {
      const jsonObj = await response.json()
      const obj = this.converter.deserializeArray<T>(jsonObj, classReference)

      return {
        status: response.status,
        error: null,
        result: obj
      }
    }
    return {
      status: response.status,
      error: response.text(),
      result: null
    }
  }
}
