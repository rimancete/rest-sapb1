export interface DatabaseResponse<T> {
  error?: DatabaseError,
  data?: T,
  count?: number
}

export interface DatabaseError {
  code: string,
  message?: string,
  innerMessage: string
}