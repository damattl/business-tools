import type { GraphResource } from "$common/graph/resources"
import { GRAPH_ENDPOINT_HOST } from "$common/graph/resources"
import type { DriveItem } from "@microsoft/microsoft-graph-types"

export const CONTENT_TYPE = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  json: 'application/json',
  text: 'plain/text',
  pdf:  'application/pdf'
}

export function buildResourceConfig(endpoint: string, scopes: string[]): GraphResource {
  return {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me${endpoint}`,
    scopes: scopes,
  }
}

export function getDriveItemPath(item: DriveItem, append= "") {
  return `${GRAPH_ENDPOINT_HOST}v1.0/me/drives/${item.parentReference.driveId}/items/${item.id}${append}`
}
