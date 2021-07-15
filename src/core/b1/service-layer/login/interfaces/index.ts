export interface LoginRequest {
  readonly username: string;
  readonly password: string;
};

export interface ServiceLayerLoginRequest {
  readonly CompanyDB: string;
  readonly UserName: string;
  readonly Password: string;
};

export interface LoginResponse {
  SessionId: string,
  SessionTimeout: number
}

