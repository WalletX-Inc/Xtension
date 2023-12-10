import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";

import { log } from "../../utils/helper";

export function validateBiometric() {
  return async (deviceId: string) => {
    const challenge = v4();
      console.log('in validateBiomatric')
    const authentication = await client.authenticate([deviceId], challenge, {
        authenticatorType: "both",
        userVerification: "required",
        timeout: 60000,
      });
  
      if(authentication.credentialId){
        log("[validateBiometric Hook] Biometric validated", null, "success");
        return true;
      }

      log("[validateBiometric Hook] Biometric failed", null, "error");
      return false;
  }  
}
