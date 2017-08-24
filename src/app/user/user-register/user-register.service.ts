import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { User } from '../model/user-model';
import { HttpService } from '../../shared/service/http/http.service';
import { NotifyService } from '../../shared/service/notifyService/notify.service';
import { Router } from '@angular/router';

@Injectable()
export class UserRegisterService {
    public userRegisterURL = 'mock-data/user-register-mock.json';
    public testEmailURL = '';
    public subject: Subject<User> = new Subject<User>();

    constructor(private http:HttpService,private route:Router,private toast: NotifyService) {
    }

    public get currentUser():Observable<User>{
        return this.subject.asObservable();
    }

    public register(user: User){
        console.log(user);
        this.http.post('login/register',user).then(res => {
            this.route.navigateByUrl('login');
        },rej => {
            this.toast.createNotification('error','登录失败','请核对账号密码');
        });
    }

    public testEmail(email:string){
        return true;
    }
}
