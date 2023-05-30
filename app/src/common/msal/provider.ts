import {
  type AccountInfo,
  type AuthenticationResult, type AuthorizationUrlRequest,
  type Configuration,
  CryptoProvider,
  PublicClientApplication
} from "@azure/msal-node"
import { BrowserWindow } from "electron"
import { AuthProtocolListener } from "./protocolListener"

interface AuthCodeUrlParams {
  redirectUri: string;
  scopes: string[];
}

const REDIRECT_URI = "msal://redirect"

export class AuthProvider {
  private clientApplication: PublicClientApplication
  account: AccountInfo | null
  private cryptoProvider: CryptoProvider
  private readonly customFileProtocolName: string
  private authCodeUrlParams!: AuthCodeUrlParams
  private authCodeRequest!: { redirectUri: string; code: null; scopes: string[] }
  private pkceCodes!: { challengeMethod: string; verifier: string; challenge: string }

  constructor(msalConfig: Configuration) {
    this.clientApplication = new PublicClientApplication(msalConfig)
    this.account = null;
    this.cryptoProvider = new CryptoProvider()

    this.customFileProtocolName = REDIRECT_URI.split(":")[0];
    this.setRequestObjects();
  }

  static createAuthWindow() {
    return new BrowserWindow({
      width: 400,
      height: 600,
    })
  }

  private setRequestObjects() {
    const requestScopes = ["User.Read"];

    this.authCodeUrlParams = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
    }

    this.authCodeRequest = {
      scopes: requestScopes,
      redirectUri: REDIRECT_URI,
      code: null,
    }

    this.pkceCodes = {
      challengeMethod: "S256",
      verifier: "",
      challenge: "",
    }
  }

  async login() {
    const authResult = await this.getTokenInteractive(this.authCodeUrlParams);
    return this.handleResponse(authResult);
  }

  async logout() {
    if (this.account) {
      await this.clientApplication.getTokenCache().removeAccount(this.account);
      this.account = null;
    }
  }

  async getToken(tokenRequest): Promise<AuthenticationResult | null> {
    let authResponse: AuthenticationResult | null;
    const account = this.account || (await this.getAccount())
    if (account) {
      tokenRequest.account = account;
      authResponse = await this.getTokenSilent(tokenRequest);
    } else {
      const authCodeRequest = {
        ...this.authCodeUrlParams,
        ...tokenRequest,
      }

      authResponse = await this.getTokenInteractive(authCodeRequest);
    }

    return authResponse || null;
  }

  async getTokenSilent(tokenRequest): Promise<AuthenticationResult | null> {
    try {
      return await this.clientApplication.acquireTokenSilent(tokenRequest);
    } catch (error) {
      console.log(
        "Silent token acquisition failed, acquiring token using pop up"
      )
      const authCodeRequest = {
        ...this.authCodeUrlParams,
        ...tokenRequest,
      }
      return await this.getTokenInteractive(authCodeRequest);
    }
  }

  async getTokenInteractive(tokenRequest): Promise<AuthenticationResult> {
    const { verifier, challenge} = await this.cryptoProvider.generatePkceCodes()
    this.pkceCodes.verifier = verifier;
    this.pkceCodes.challenge = challenge;
    const popupWindow = AuthProvider.createAuthWindow();

    const authCodeUrlParams: AuthorizationUrlRequest = {
      ...this.authCodeUrlParams,
      scopes: tokenRequest.scopes,
      codeChallenge: this.pkceCodes.challenge,
      codeChallengeMethod: this.pkceCodes.challengeMethod,
    }

    try {
      const authCodeUrl = await this.clientApplication.getAuthCodeUrl(
        authCodeUrlParams
      )
      const authCode = await this.listenForAuthCode(authCodeUrl, popupWindow);
      const authResult = await this.clientApplication.acquireTokenByCode({
        ...this.authCodeRequest,
        code: authCode,
        codeVerifier: verifier,
      });

      popupWindow.close();
      return authResult;

    } catch (error) {
      popupWindow.close();
      throw error;
    }
  }

  async listenForAuthCode(navigateUrl: string, authWindow: BrowserWindow): Promise<string> {
    const authCodeListener = new AuthProtocolListener(
      this.customFileProtocolName
    )

    const codePromise = authCodeListener.start();
    await authWindow.loadURL(navigateUrl);
    const code = await  codePromise;
    authCodeListener.close();
    return code;
  }

  async handleResponse(response: AuthenticationResult): Promise<AccountInfo | null> {
    if (response !== null) {
      this.account = response.account;
    } else {
      this.account = await this.getAccount()
    }

    return this.account;
  }

  async getAccount(): Promise<AccountInfo | null> {
    const cache = this.clientApplication.getTokenCache();
    const currentAccounts = await cache.getAllAccounts();

    if (currentAccounts === null) {
      console.log("No accounts detected");
      return null;
    }

    if (currentAccounts.length > 1) {
      console.log(
        "Multiple accounts detected, need to add choose account code."
      )
      return currentAccounts[0];
    } else if (currentAccounts.length === 1) {
      return currentAccounts[0];
    } else {
      return null;
    }
  }
}
