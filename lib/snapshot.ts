import { decide } from "./decide";
import { sha256 } from "./hash";
import type { Decision, Evidence, Receipt } from "./types";

export const GENESIS = "0".repeat(64);

/** Append a receipt. Each hash covers the previous one, so history cannot be edited quietly. */
export function appendReceipt(chain: Receipt[], ev: Evidence, decision: Decision): Receipt {
  const prevHash = chain.length ? chain[chain.length - 1].hash : GENESIS;
  const evidenceHash = sha256(ev);
  const decisionHash = sha256(decision);
  const receipt: Receipt = {
    index: chain.length,
    token: ev.token,
    prevHash,
    evidenceHash,
    decisionHash,
    hash: sha256({ prevHash, evidenceHash, decisionHash }),
  };
  chain.push(receipt);
  return receipt;
}

export function verifyChain(chain: Receipt[]): boolean {
  let prev = GENESIS;
  return chain.every((r) => {
    const ok = r.prevHash === prev && r.hash === sha256({ prevHash: r.prevHash, evidenceHash: r.evidenceHash, decisionHash: r.decisionHash });
    prev = r.hash;
    return ok;
  });
}

/** Re-run the decision from stored evidence and check it matches the receipt. */
export function replay(ev: Evidence, receipt: Receipt): { matches: boolean; decision: Decision } {
  const decision = decide(ev);
  return { matches: sha256(ev) === receipt.evidenceHash && sha256(decision) === receipt.decisionHash, decision };
}
