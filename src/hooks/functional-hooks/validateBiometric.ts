import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";

export function validateBiometric() {
  return async (deviceId: string) => {
    const challenge = v4();

    const authentication = await client.authenticate([deviceId], challenge, {
        authenticatorType: "both",
        userVerification: "required",
        timeout: 60000,
      });
  
      if(authentication.credentialId){
        console.log("[validateBiometric Hook] Biometric validated");
        return true;
      }

      console.log("[validateBiometric Hook] Biometric failed");
      return false;
  }  
}
