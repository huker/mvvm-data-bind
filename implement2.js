/**
 * Created by huk on 2018/2/24.
 */

//双向绑定2 - 脏值检查

let Scope = function () {
    //监听的属性的数组
    this.$$watchers = [];
};

Scope.prototype.digest = function () {
    //每次apply先默认调一次检查
    let dirty = true;
    do {
        dirty = this.digestOne();
    } while (dirty)
};

Scope.prototype.digestOne = function () {
    let dirty = false;
    //遍历检查$$watchers是否脏了
    this.$$watchers.forEach((_watcher) => {
        const oldVal = _watcher.oldValue;
        const newVal = this[_watcher.attr];
        //脏了
        if (oldVal !== newVal) {
            _watcher.fn(oldVal, newVal);
            _watcher.oldValue = newVal;
            //脏了就要调用fn 调用fn的时候，可能会有新的脏值，所以每次调了就重新check一次
            dirty = true
        }
    });
    return dirty
};

Scope.prototype.$watch = function (attr, fn) {
    //回调，监听的属性，属性的oldVal
    this.$$watchers.push({
        fn,
        attr,
        oldValue: this[attr]
    });
};

Scope.prototype.$apply = function () {
    this.digest();
};

let scope = new Scope();

scope.name = 'huker';
scope.age = 20;

scope.$watch('name', function (oldVal, newVal) {
    console.log(oldVal, newVal);
});

scope.$watch('age', function (oldVal, newVal) {
    console.log(oldVal, newVal);
    scope.name = 'sieg';
});

scope.age = 21;
scope.age = 24;

scope.$apply();