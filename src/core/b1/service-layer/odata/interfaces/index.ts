export interface ODataResponse<T> {
  error?: ODataError,
  count?: number,
  data?: T
}

export interface ODataError {
  code: string,
  message?: string,
  innerMessage: string
}
