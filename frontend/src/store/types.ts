export interface RootState {
  version: string,
}

export interface AuthState {
  token: string,
  user?: string
  status: string
}
