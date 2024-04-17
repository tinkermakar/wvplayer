export class Problem extends Error {
  #status = 500;
  constructor(message: string, status?: number) {
    super(message);
    if (status) this.#status = status;
  }

  get status() {
    return this.#status;
  }
}
