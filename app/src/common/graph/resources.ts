export const GRAPH_ENDPOINT_HOST = "https://graph.microsoft.com/"; // include the trailing slash

export interface GraphResource {
  endpoint: string,
  scopes: string[]
}

export const protectedResources = {
  graphMe: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me`,
    scopes: ["User.Read"],
  },
  graphMessages: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me/messages`,
    scopes: ["Mail.Read"],
  },
  graphContacts: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me/contacts`,
    scopes: ["Contacts.Read"],
  },
  graphDrives: {
    endpoint: `${GRAPH_ENDPOINT_HOST}v1.0/me/drives`,
    scopes: ["Files.Read"],
  }
};
