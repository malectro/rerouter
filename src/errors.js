// @flow

// NOTE (kyle): we don't extend Error until it is fully supported by our target
// environment (browsers, babel).

export class AbortError {
  reason: string;
  constructor(reason: string) {
    this.reason = reason;
  }
}
