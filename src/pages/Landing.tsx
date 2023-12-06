// Zupass Proof of concept.
import { useState } from 'react'

import {
  openSemaphoreSignaturePopup,
  usePCDMultiplexer,
  usePendingPCD,
  useSemaphoreSignatureProof,
  useZupassPopupMessages,
} from '@pcd/passport-interface'


export const IS_PROD = import.meta.env.NODE_ENV === "production";
console.log("🚀 ~ file: Landing.tsx:14 ~ IS_PROD:", IS_PROD)
export const IS_STAGING = import.meta.env.NODE_ENV === "staging";
console.log("🚀 ~ file: Landing.tsx:16 ~ IS_STAGING:", IS_STAGING)
console.log(window.location.origin + '#/popup',);


const ZUPASS_URL = 
// IS_PROD
  // ? "https://zupass.org/"
  // : IS_STAGING
  // ? 
  "https://staging.zupass.org/"
  // : "http://localhost:3000/";

const ZUPASS_SERVER_URL = 
// IS_PROD
  // ? "https://api.zupass.org/"
  // : IS_STAGING
  // ? 
  "https://api-staging.zupass.org/"
  // : "http://localhost:3002/";


const MESSAGE_TO_SIGN = 'Hi Lexicon'

function Landing() {
  const [zupassPCDStr, zupassPendingPCDStr] = useZupassPopupMessages()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, __, serverPCDStr] = usePendingPCD(
    zupassPendingPCDStr,
    ZUPASS_SERVER_URL
  )
  const pcdStr = usePCDMultiplexer(zupassPCDStr, serverPCDStr)

  const [signatureProofValid, setSignatureProofValid] = useState<
    boolean | undefined
  >()
  const onProofVerified = (valid: boolean) => {
    setSignatureProofValid(valid)
  }

  const { signatureProof } = useSemaphoreSignatureProof(pcdStr, onProofVerified)

  const handleSignatureRequest = () => {
    openSemaphoreSignaturePopup(
      ZUPASS_URL,
      window.location.origin + '#/popup',
      MESSAGE_TO_SIGN
    )
  }

  return (
    <>
      <h1>Zupass test</h1>
      <button onClick={handleSignatureRequest}>
        Request Semaphore signature
      </button>

      {signatureProof != null && (
        <>
          <p>Got Semaphore Signature Proof from Zupass</p>

          <p>{`Message signed: ${signatureProof.claim.signedMessage}`}</p>
          {signatureProofValid === undefined && <p>❓ Proof verifying</p>}
          {signatureProofValid === false && <p>❌ Proof is invalid</p>}
          {signatureProofValid === true && <p>✅ Proof is valid</p>}
          <pre>{JSON.stringify(signatureProof, null, 2)}</pre>
        </>
      )}
    </>
  )
}

export default Landing
