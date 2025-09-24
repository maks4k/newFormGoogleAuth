export interface IUserPrivate{
    id:number;
    email:string;
    password:string;
}
export interface IUserPublick {
  id: IUserPrivate["id"];
  email: IUserPrivate["email"];
}