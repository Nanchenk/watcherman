import { isArray, isFunction, noop } from './untils';
import FrameWatcher from './fps';

class PerformanceWatcher {
  constructor() {
    // 包含所有检测指标的map
    this.watcherMap = null;

    // 性能监视器
    this.performanceObserver = null;

    // fps 监视器
    this.fpsWatcher = null;

    // fps 的监视结果
    this.fps = null;

    // 检测的回调
    this.cb = noop;
  }

  /**
   * init performance watcher
   * @param entryTypes 监视的类型
   * @param cb 获取数据后的回调
   * @param duration 调用回调的频率
   */
  init({ entryTypes = ['longtask', 'paint', 'resource', 'fps', 'mark', 'measure'], cb, duration = 1000 }) {
    if (!isArray(entryTypes) || (isArray(entryTypes) && entryTypes.length === 0) || !cb || !isFunction(cb)) {
      return;
    }

    this.cb = cb;

    this.initPerfWatcher(entryTypes, duration);

    this.initFpsWatcher(duration);
  }

  /**
   * 初始化性能监控器
   * @param entryTypes 性能指标的类型
   * @param duration   回调延迟时间
   */
  initPerfWatcher(entryTypes, duration) {
    this.initWatcherMap(entryTypes);
    let startTime = performance.now();

    this.performanceObserver = new PerformanceObserver(list => {
      // 当记录一个新的性能指标时执行
      try {
        // performanceObserver 回调执行的时间
        const endTime = performance.now();

        // 是否需要执行回调
        const isNeedCb = endTime - startTime >= duration;

        // 返回一个列表，该列表包含一些用于承载各种性能数据的对象，不做任何过滤
        const perfEntries = list.getEntries();

        for (let i = 0; i < perfEntries.length; i++) {
          const entryType = perfEntries[i].entryType;
          const entryTypeValueList = this.watcherMap.get(entryType);

          entryTypeValueList.push(perfEntries[i]);
          this.watcherMap.set(entryType, entryTypeValueList);
        }

        if (isNeedCb) {
          this.report();
          this.initWatcherMap(entryTypes);
          startTime = performance.now();
        }
      } catch (e) {
        this.closeWatcher();
        throw new Error(`PerformanceObserver ${e}`);
      }
    });

    // register observer for entryType's notifications
    this.performanceObserver.observe({ entryTypes });
  }

  /**
   * 初始化交互的fps响应监视器
   * @param duration   回调延迟时间
   */
  initFpsWatcher = duration => {
    this.fpsWatcher = new FrameWatcher(duration, this.setFpsInfo);
    this.fpsWatcher.watch();
  };

  setFpsInfo = fpsInfo => {
    this.fps = fpsInfo;
    this.report();
  };

  /**
   * 组织检测的指标信息，通过 cb 传出
   */
  report = () => {
    this.watcherMap.set('fps', this.fps);

    this.cb(this.watcherMap);
  };

  initWatcherMap = entryTypes => {
    const watcherMap = new Map();

    for (let i = 0, l = entryTypes.length; i < l; i++) {
      watcherMap.set(entryTypes[i], []);
    }

    this.watcherMap = watcherMap;
  };

  closeWatcher() {
    if (this.performanceObserver && this.performanceObserver.disconnect) {
      this.performanceObserver.disconnect();
    }

    if (this.fpsWatcher && this.fpsWatcher.close) {
      this.fpsWatcher.close();
    }
  }
}

export default new PerformanceWatcher();
