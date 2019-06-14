class FrameWatcher {
  constructor(duration = 1000, cb) {
    // fps 监控的周期
    this.duration = duration;

    // 监控周期到了之后的回调
    this.cb = cb;

    // 上一次绘制的时间
    this.preFrameTime = 0;

    // 下一次绘制的时间
    this.lastFrameTime = 0;

    // 监控的周期内fps列表
    this.fpsList = [];
  }

  // 开始监控 fps 的变化情况
  watch() {
    // 监控周期的开始时间
    this.durStartTime = performance.now();
    this.startTime = performance.now();
    this.frame = 0;

    this.calFps();
  }

  /**
   * 通过两次绘制之间的时间计算fps
   */
  calFps = () => {
    const now = performance.now();

    if (now - this.durStartTime >= this.duration) {
      this.cb(this.report());

      this.durStartTime = performance.now();
      this.fpsList = [];
    }

    if (this.preFrameTime) {
      this.frame++;
      this.lastFrameTime = performance.now();

      // 计算 300ms 内的 fps
      if (this.lastFrameTime - this.startTime >= 166) {
        const fps = Math.floor((this.frame * 1000) / (this.lastFrameTime - this.startTime));

        this.fpsList.push(fps);

        this.frame = 0;
        this.startTime = performance.now();
      }
    } else {
      // 调用calFps的第一次，没有rAF所以在这里初始化frame的计数器值
      this.preFrameTime = performance.now();
      this.frame = 0;
    }

    this.fpsWatcher = window.requestAnimationFrame(this.calFps);
  };

  report = () => {
    const avgFps = Math.floor(this.fpsList.reduce((accumulator, curr) => accumulator + curr, 0) / this.fpsList.length);

    return {
      avgFps,
      fpsList: this.fpsList,
    };
  };

  close() {
    if (this.fpsWatcher) {
      window.cancelAnimationFrame(this.fpsWatcher);
    }
  }
}

export default FrameWatcher;
