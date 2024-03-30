export class Problem extends Error {
  #code = 500;
  constructor(message: string, code?: number) {
    super(message);
    if (code) this.#code = code;
  }

  get code() {
    return this.#code;
  }
}
