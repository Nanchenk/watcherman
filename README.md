# watcherman
Implementation of the RAIL model for monitoring the runtime performance of a website

## 用于监控网页运行时性能指标，可搭建RAIL模型
* R(Response): 返回用户click及关键操作的反馈时间
* A(Animation): 返回用户交互过程中，生成帧的时间，通过fps体现
* I(Idle): 返回交互过程中主线程的空闲情况，通过 longTask 体现
* L(Load): 返回资源加载情况，包含 resource 的加载情况，以及自定义的打标情况

## 使用方法

1. 引入watcherman

2. 通过init指定希望检测的指标以及检测时间
init 接受一个对象，包含如下参数：
entryTypes： 希望获取的performance信息
默认的指标为['longtask', 'paint', 'resource', 'fps', 'mark', 'measure']

duration: 监控的周期

cb: 回调函数

example:
```javascript
performanceWatcher.init({
 entryTypes: ['longtask'],
 duration: 2000,
 cb
});
```
