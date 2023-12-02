import { client } from "@passwordless-id/webauthn";
import { v4 } from "uuid";

import { log } from "../../utils/helper";

function validateBiometric() {
  return async (deviceId: string) => {
    const challenge = v4();

    const authentication = await client.authenticate([deviceId], challenge, {
      authenticatorType: "both",
      userVerification: "required",
      timeout: 60000,
    });

    if (authentication.credentialId) {
      log("[validateBiometric Hook] Biometric validated", null, "success");
      return true;
    }

    log("[validateBiometric Hook] Biometric failed", null, "error");
    return false;
  };
}

export default validateBiometric;
