import { Injectable } from '@angular/core';

@Injectable()
export class EvBusService {
  private static events = {};

  constructor() { }

  public $on (type: string, callback: Function) {
    if(EvBusService.events[type]){
      EvBusService.events[type].push(callback);
      return;
    }
    EvBusService.events[type] = [callback];
  }

  public $emit(type: string, ...args) {
    if(EvBusService.events[type]){
      EvBusService.events[type].array.forEach((callback, index) => {
        callback(...args);
      });
    }
  }

  public $remove(type: string, callback:Function) {
    if(!callback){
      EvBusService.events[type] = [];
      return;
    }
    for(let i = 0; i< EvBusService.events[type].length; i++){
      if(EvBusService.events[type][i] === callback){
        EvBusService.events[type].splice(i,1);
      }
    }
  }

}
