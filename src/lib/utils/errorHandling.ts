export class Problem extends Error {
  headers?: Record<string, string>;
  #status = 500;
  constructor(message: string, status?: number) {
    super(message);
    if (status) this.#status = status;
  }

  get status() {
    return this.#status;
  }
}
