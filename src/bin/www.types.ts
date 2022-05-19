export type Addr =
  null
  | string
  | {
  address: string,
  family: string,
  port: number,
};

export interface Err {
  syscall?: string,
  code?: string,
}
