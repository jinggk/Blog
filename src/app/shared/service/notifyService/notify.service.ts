import { Injectable } from '@angular/core';
import {NzNotificationService,NZ_NOTIFICATION_CONFIG} from 'ng-zorro-antd';

@Injectable()
export class NotifyService {

  constructor(private notification: NzNotificationService) { }

  // param : {type: [{'success',成功},{'info',查看},{'warning',警告},{'error',错误}],title:标题,content:内容}
  public createNotification = (type,title,content) => {
    this.notification.create(type, title, content);
  };
}
