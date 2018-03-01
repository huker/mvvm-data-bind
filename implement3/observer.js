/**
 * Created by huk on 2018/2/27.
 */

let data = {
    name: 'huk'
};

observer(data);

data.name = 'sieg';

function observer(data) {
    //遍历（子属性也要遍历）
    if (!data || typeof data !== 'object') {
        return
    }
    Object.keys(data).forEach(function (key) {
        defineProp(key, data, data[key])
    })
}

//原理语法 Object.defineProperty(obj, prop, descriptor)
function defineProp(key, data, val) {
    //把属性添加进订阅器
    let dep = new Dep();

    //每个属性修改property时再检测一次子属性
    observer(val);
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能再define
        set: function (newVal) {
            console.log("change===>", val, newVal);
            val = newVal;
            //通知订阅者
            dep.notify();
        },
        get: function () {
            return val
        }
    })

    //消息订阅器
    function Dep() {
        //维护一个订阅者的数组
        this.subs = [];
    }

    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub)
    };

    Dep.prototype.notify = function () {

    };
}