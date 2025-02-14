Function.prototype.myBind = function(context) {
    // 1.判断调用对象是否为函数，非函数则error
    if (typeof this !== 'function') {
        throw new TypeError('error');
    }
    // 2.保存当前函数的引用，获取其余传入参数值。
    let args = Array.prototype.slice.call(arguments, 1)
    let fn = this; // this就是函数
    // 3.创建一个函数返回
    // 4.函数内部使用 apply 来绑定函数调用，需要判断函数作为构造函数的情况，这个时候需要传入当前函数的 this 给 apply 调用，其余情况都传入指定的上下文对象。
    let resultFn = function() {
        return fn.apply(
        // 如果为true，那就是返回的函数resultFn作为了一个构造函数使用，那么this指向新实例，不再是context
        // 如果为false，那就是返回的函数resultFn作为了一个普通函数使用，那么this指向context或者window
            this instanceof resultFn ? this : context,
            args.concat(...arguments)
        )
    }
    // 重新绑定原型
    // 这样写，使returnFn作为一个构造函数使用的时候，那么通过原型继承的方法，returnFn可以继承当前对象里面原型上面所有属性和方法
    // 修正prototype之后，创建的新实例，可以继承原型的属性和方法，例如例子，实例newObj继承了，this.phoneNumber中的属性值。
    resultFn.prototype = fn.prototype;
    return resultFn;
}


// DEMO
let person = {
    name: 'zs',
}
function say(age) {
    console.log(this.name, age);
}
let sayPerson = say.bind(person, 22);
sayPerson() // 原生方法打印：zs 22
let sayPerson2 = say.myBind(person, 22);
sayPerson() // 手写方法打印：zs 22

// DEMO2 
var name = '张三'
var obj = {
    name: '李四'
}

function fn(age, weight) {
    console.log(this.name); // undefined
    console.log(age, weight); // 18 150
    this.phoneNumber = '88888888'
}

fn.prototype.haveMoney = 'No';
var getFn = fn.myBind(obj, 18);
var newObj = new getFn(150);

console.log(newObj.haveMoney); // No
console.log(newObj.phoneNumber); // 88888888
// 参考链接：https://blog.csdn.net/qq_18599727/article/details/124173776