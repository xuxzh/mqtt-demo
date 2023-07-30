import { Component } from '@angular/core';
import { MqttConfigService } from './mqtt.service';
import mqtt from "mqtt/dist/mqtt";
import { IClientOptions, MqttClient } from 'mqtt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  client: MqttClient | null = null;
  topic = 'Test'
  url = 'ws://broker.emqx.io:8083/mqtt'
  options:IClientOptions = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // 认证信息
    clientId: 'emqx_test',
    username: 'emqx_test',
    password: 'emqx_test',
  }

  isClientReady = false;
  isSubReady = false;

  message = ''

  receiveMsg = '';

  constructor(private mqttSer:MqttConfigService) {
    //
  }

  /** 初始化连接 */
  initConnection() {
    // alert('正在初始化mqtt连接，请稍后。。。')
    this.client = mqtt.connect(this.url, this.options);
    this.client.once('connect', () => {
      this.isClientReady = true;
      alert('mqtt连接初始化成功！')
    })
    this.client.once('error', (error) => {
      alert(`mqtt连接初始化失败:${error.message}`)
    });
    this.mqttSer.closeConnection(this.client).subscribe(() => {
      console.log('mqtt连接关闭！！');
    });
  }

  /** 关闭连接 */
  closeConnection() {
    if (this.client) {
      this.mqttSer.dismiss(this.client, false, void 0, (err) => {
        if (!err) {
          alert(`断开连接成功`)
          this.isClientReady = false;
          this.client = null;
        } else {
          alert(`断开连接失败:${err.message}`)
        }
      });
    }
  }

  /** 发布消息 */
  publish() {
    if (!this.client) {
      alert('mqtt连接未初始化！');
      return;
    }
    this.mqttSer.publishTopic(this.client, this.topic, this.message)
  }

  /** 订阅主题 */
  subscribeTopic() {
    this.mqttSer.subscribeTopic(this.client as MqttClient, this.topic, (err) => {
      if (!err) {
        window.alert('订阅成功')
        this.isSubReady = true;
        this.mqttSer.receiveMessage(this.client as MqttClient, (topic, payload:Buffer) => {
          console.log(topic);
          console.log(payload.toString());
          this.receiveMsg=`主题：${topic}\n内容:${payload.toString()}`;
        })
      } else {
       console.log(`订阅失败:${err.message}`)
        this.isSubReady = false;
      }
    })
  }

  /** 取消订阅 */
  unsubscribeTopic() {
    if (!this.client) {
      alert('客户端未初始化!')
      return;
    }
    this.mqttSer.unSubscribeTopic(this.client, this.topic, void 0,(err) => {
      if (!err) {
        this.isSubReady = false;
        alert('取消订阅成功！')
      } else {
        alert(`取消订阅失败:${err.message}`)
      }
    })
  }
}
