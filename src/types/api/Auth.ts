export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
  }
  export interface LoginFormValues {
    email: string;
    password: string;
   }
   
   export interface UserFormValues {
    email: string;
    password: string;
    displayName: string;
   }
 