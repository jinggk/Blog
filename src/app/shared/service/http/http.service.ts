import { Injectable, Injector } from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import webUrl from '../../../..//webconfig';
import { ResponseData, TimeoutRequest } from './http-model';
import {NotifyService} from '../notifyService/notify.service';
import {EvBusService} from '../ev-bus/ev-bus.service';
@Injectable()
export class HttpService {
  private static readonly TIMEOUT_CODE = '1000005';
  private static timer: any;
  private static httpCount: string[] = [];
  private static timeoutRequestMap: Map<string,TimeoutRequest> = new Map();
  private static httpNoLoad: string[] = [];
  private headers = new Headers({'Content-Type': 'application/json', 'Accept': '*'});
  private static createQueryString(params: Object): string {
    let paramStr = '?';
    if(params){
      Object.keys(params).forEach(param => {
        if(params.hasOwnProperty(param)){
          paramStr += (`${param}=${params[param]}&`);
        }
      });
    }
    paramStr = paramStr.substring(0, paramStr.length - 1);
    return paramStr;
  }

  constructor(private http: Http,
              private toast: NotifyService,
              private evBus: EvBusService,
              private injector: Injector) { }


  public post(api: string, param: Object = {}): Promise<any>{
    return new Promise((res, rej) => {
      const apiName = api + JSON.stringify(param);
      this.showLoadding(apiName, api);
      const httpRes = this.http.post(`${webUrl}${api}`,JSON.stringify(param),{headers:this.headers})
      .subscribe(response => {
        this.afterRequest(api, param, response, 'post').then(result => {
          this.successHandle(result as any, res, rej, apiName, api);
        })
      },err => {
        this.handleError(err, rej, apiName, api);
     })
    });
  }

  public get(api: string, param: Object = {}): Promise<any>{
    const paramStr = HttpService.createQueryString(param);
    const apiName = api + paramStr;
    return new Promise((res, rej) => {
      this.showLoadding(apiName, api);
      const httpRes = this.http.get(`${webUrl}${api}\\${paramStr}`,{headers:this.headers})
      .subscribe(response => {
        this.afterRequest(api, param, response).then(result => {
          this.successHandle(result as any, res, rej, apiName, api);
        })
      },err => {
        this.handleError(err, rej, apiName, api);
     })
    });
  }

  private showLoadding(api, url){
    if(HttpService.httpCount.length > 0 && HttpService.httpCount.indexOf(api) >= 0){
      return;
    }
    HttpService.httpCount.push(api);
    if (HttpService.httpCount.length > 1) {
      return;
    }
    const self = this;
    if (HttpService.timer) {
      clearTimeout(HttpService.timer);
    }
    HttpService.timer = setTimeout(_ => {
      self.evBus.$emit('showLoading');
    }, 300);
  }

  private hideLoadding(api, url) {
    if(HttpService.httpCount.indexOf(url) >= 0){
      return;
    }
    for(let i = HttpService.httpCount.length - 1;i >= 0 ; i--){
      if (HttpService.httpCount[i] === api) {
        HttpService.httpCount.splice(i, 1);
      }
    }
    if (HttpService.httpCount.length > 0) {
      return;
    }
    this.evBus.$emit('hideLoading');
    clearTimeout(HttpService.timer);
  }

  private afterRequest(api: string, param: Object = {}, response, method = 'get'){
    const resp = response.json() as ResponseData;
    console.log(resp, 'after');
    if(resp.Code.toString() !== HttpService.TIMEOUT_CODE){
      return Promise.resolve(resp);
    }
    HttpService.timeoutRequestMap.set(api,{api,param,method});
    // 这里假设的是超时登录，timeout-code是超时的code码，发现超时自动登录，暂时先不写自动登录，后续再加。
    return Promise.resolve(resp);
  }

  private successHandle(RespData: ResponseData, resolve, reject, apiName, url){
    console.log(RespData);
    this.hideLoadding(apiName, url);
    const self = this;
    if (RespData.Code !== 0 && RespData.Code.toString() !== HttpService.TIMEOUT_CODE) {
      self.toast.createNotification('warning','失败',RespData.Message);
      return reject(RespData.Message);
    }
    self.toast.createNotification('success','成功','');
    return resolve(RespData.Value as any);
  }

  private handleError(err, reject, apiName, url) {
    let errMsg = '服务器错误';
    if (err.status === 0) {
      errMsg = '无网络';
    }
    this.toast.createNotification('warning','失败','请检测网络环境');
    this.hideLoadding(apiName, url);
    return reject(err);
  }

}
