import { Injectable } from '@angular/core';
import mqtt from "mqtt/dist/mqtt";
import { Observable } from 'rxjs';

import { Client, ClientSubscribeCallback, CloseCallback, IClientOptions, IClientSubscribeOptions, MqttClient, OnMessageCallback, PacketCallback } from 'mqtt';
@Injectable({
  providedIn: 'root'
})
export class MqttConfigService {
  constructor() { }

  /** 连接关闭 */
  closeConnection = (client: Client) => {
    return new Observable((observer) => {
      client.on('close', () => {
        observer.next();
        observer.complete();
      })
    })
  }

  /** 初始化mqtt连接 */
  initMqttConnection(url: string, options: IClientOptions): Promise<MqttClient> {
    return new Promise((resolve, reject) => {
      const client = mqtt.connect(url, options)
      client.on('connect', () => {
        console.log('mqtt 已连接')
        resolve(client);
      })
      client.on('error', (err: Error) => {
        alert(`初始化mqtt发生错误:${err.message}`)
        reject()
      })
    })
  }

  /** 订阅相应主题 */
  subscribeTopic(client: MqttClient, topic: string, cb?: ClientSubscribeCallback) {
    // 订阅主题 RH/BOX/Acquire
    client.subscribe(topic, cb)
  }

  /** 取消订阅相应主题 */
  unSubscribeTopic(client: MqttClient, topic: string, opts?: IClientSubscribeOptions, cb?: PacketCallback) {
    client.unsubscribe(topic, opts, cb)
  }

  /** 订阅信息事件 */
  receiveMessage(client: MqttClient, cb: OnMessageCallback) {
    client.on('message', cb);
  }

  /** 发布对应主题的信息 */
  publishTopic(client: MqttClient, topic: string, message: string,cb?:PacketCallback) {
    client.publish(topic, message, cb)
  }

  /** 关闭连接 */
  dismiss(client: MqttClient, force?: boolean, opts?: IClientSubscribeOptions, cb?: CloseCallback) {
    client.end(force, opts, cb);
  }

}
