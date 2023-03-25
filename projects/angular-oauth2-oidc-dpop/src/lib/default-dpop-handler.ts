import * as rs from 'jsrsasign';
import {
    DPoPHandler
} from 'angular-oauth2-oidc';

interface SigningAlgEntry {
    key: string,
    alg: string,
    keylenOrCurve: any,
    keyPair: any
}

const supportedAlgs: Array<SigningAlgEntry> = [
    { key: "ES256", alg: "EC", keylenOrCurve: "secp256r1", keyPair: null }
]

export class DefaultDPoPHandler implements DPoPHandler {

    private selectedAlg: SigningAlgEntry = null;

    initialize(signingAlgValuesSupported: Array<string>) {

        supportedAlgs.forEach((supportedAlg) => {
            if (signingAlgValuesSupported[0].includes(supportedAlg.key)) { // TODO change to [0] when identityserver fixed
                this.selectedAlg = supportedAlg;
                this.selectedAlg.keyPair = rs.KEYUTIL.generateKeypair(supportedAlg.alg, supportedAlg.keylenOrCurve);
                return;
            }
        });
        if(!this.selectedAlg) {
            throw new Error(
                `DPoP handler no supported Alg found`
            );    
        }
    }

    getDPoPHeader(httpMethod: string, httpUri: string): string {

        if (!this.selectedAlg) {
            throw new Error(
                `DPoP handler not initialized`
            );
        }

        let jwk = rs.KEYUTIL.getJWKFromKey(this.selectedAlg.keyPair.pubKeyObj);
        let jws = rs.KJUR.jws.JWS.sign(this.selectedAlg.key, {
            "typ": "dpop+jwk", // TODO change to dpop+jwt when identityserver fixed
            "alg": this.selectedAlg.key, "jwk": jwk
        },
            { jti: crypto.randomUUID(), htm: httpMethod, htu: httpUri, iat: Math.floor(Date.now() / 1000) },
            this.selectedAlg.keyPair.prvKeyObj);

        return jws;
    }
}