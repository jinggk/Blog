import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { User } from '../model/user-model';
import {HttpService} from '../../shared/service/http/http.service';

@Injectable()
export class UserLoginService {
  public userLoginURL = 'mock-data/user-login-mock.json';
  public subject: Subject<User> = new Subject<User>();
  constructor(public http:HttpService){}

  public get currentUser():Observable<User>{
      return this.subject.asObservable();
  }

  public login(user:User){
    return new Promise((res, rej) => {
      this.http.post('login',user).then(result => {
        res(result);
      },err => {
        console.log(err);
        rej(err);
      });
    });
  }

  public logout():void{
    localStorage.removeItem('currentUser');
    this.subject.next(Object.assign({}));
  }
}
