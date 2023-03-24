import * as rs from 'jsrsasign';
import {
    DPoPHandler
} from 'angular-oauth2-oidc';

export class DefaultDPoPHandler implements DPoPHandler {

    private privateKey: any = null;

    constructor() {        
       this.privateKey =   rs.KEYUTIL.generateKeypair("EC", "secp256r1");
       console.log(this.privateKey);
    }
      
    getDPoPHeader(httpMethod:string,httpUri:string): string {

        let jwk = rs.KEYUTIL.getJWKFromKey( this.privateKey.pubKeyObj);

        let jws = rs.KJUR.jws.JWS.sign("ES256", {"typ":"dpop+jwt",
        "alg":"ES256","jwk":jwk},
         {jti:"xxyyzz",htm:httpMethod,htu:httpUri, iat: Math.floor(Date.now() / 1000) }, 
         this.privateKey.prvKeyObj);

        return jws;
    }
}