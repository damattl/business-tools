import { protocol } from "electron"

export class AuthProtocolListener {
  private hostName: string;

  constructor(hostName) {
    this.hostName = hostName;
  }

  get host() {
    return this.hostName;
  }

  start() {
    return new Promise<string>((resolve, reject) => {
      protocol.registerStringProtocol(this.host, (req) => {
        const requestUrl = new URL(req.url);
        const authCode = requestUrl.searchParams.get("code");
        if (authCode) {
          resolve(authCode);
        } else {
          protocol.unregisterProtocol(this.host);
          reject(new Error("No code found in URL"));
        }
      })
    });
  }

  close() {
    protocol.unregisterProtocol(this.host);
  }

}
