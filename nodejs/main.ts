import * as mqtt from 'mqtt';
import {IClientOptions} from 'mqtt'

// 公网测试例子
const url = 'ws://broker.emqx.io:8083/mqtt'
const options:IClientOptions = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // 认证信息
    clientId: 'emqx_test',
    username: 'emqx_test',
    password: 'emqx_test',
}

// 本地测试例子
// const url = 'ws://127.0.0.1:18009'
// const options:IClientOptions = {
//     // Clean session
//     clean: true,
//     connectTimeout: 4000,
//     // 认证信息
//     clientId: 'admin',
//     username: 'admin',
//     // password: 'emqx_test',
// }

const client = mqtt.connect(url, options)
client.on('connect', function() {
    console.log('成功连接！')
    // 订阅主题
    client.subscribe('Test', function(err:Error,...reset:any[]) {
        if (!err) {
            // 发布消息
            client.publish('Test', 'Hello mqtt')
        }
    })
})

// 接收信息监听
client.on('message', function(topic, message) {
    console.log(`收到信息，主题:${topic},内容:${message}`)
    setTimeout(() => {
        // 十秒后断开连接
        client.end()
    }, 10000);
})

// 连接断开监听
client.on('disconnect', () => {
    console.log('mqtt 连接已断开！')
})

// 连接关闭监听
// client.end()方法会触发此事件
client.on('close', () => {
    console.log('mqtt 连接已关闭!')
})