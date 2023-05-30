import { GraphResource } from "$common/graph/resources"
import type { AccountInfo } from "@azure/msal-node"
import { GraphRequest } from "@microsoft/microsoft-graph-client"

export type GraphRequestMode = "GET" | "POST" | "PUT"

export interface MsalAPI {
  login: () => Promise<AccountInfo | null>,
  logout: () => Promise<boolean>,

  getAccount: () => Promise<AccountInfo | null>,
  makeGraphRequest: (params: GraphRequestParams) => Promise<any>,
  createGraphRequest: (params: GraphRequestParams) => Promise<GraphRequest | null>
}

export type GraphRequestCallback = (api: GraphRequest) => Promise<any>

export interface GraphRequestParams {
  mode?: GraphRequestMode,
  resource: GraphResource,
  headers?: HeadersInit
  body?,
}
