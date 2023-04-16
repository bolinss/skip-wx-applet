import * as echarts from '../ec-canvas/echarts';
import api from '../../utils/apiRequest';
import util from '../../utils/util';

let chartHour = null;
let optionHour = {
  title: {
    subtext: '个数',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    boundaryGap: ['5%', '5%'],
    data: [],
  },
  yAxis: {
    show: true,
    boundaryGap: ['5%', '5%'],
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  grid: {
    left: '10%',
    bottom: '10%',
    right: '2%',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)',
    textStyle: {
      color: '#fff',
    },
    formatter(params) {
      const obj = params[0];
      let str =
        obj.axisValue + '\n' + obj.data.time + '秒 ' + obj.data.totalNum + '个';
      return str;
    },
  },
  series: [
    {
      itemStyle: {
        normal: {
          color: '#3AD39E',
          lineStyle: {
            color: '#3AD39E',
          },
        },
      },
      type: 'bar',
      data: [],
    },
  ],
};

let chartMinite = null;
let optionMinite = {
  title: {
    subtext: '个数',
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}',
    },
  },
  grid: {
    right: '5%',
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(50,50,50,0.7)',
    textStyle: {
      color: '#fff',
    },
    formatter(params) {
      const obj = params[0];
      let str = '第' + obj.axisValue + '秒 ' + obj.data + '个';
      return str;
    },
  },
  series: [
    {
      itemStyle: {
        normal: {
          color: '#3AD39E',
          lineStyle: {
            color: '#3AD39E',
          },
        },
      },
      type: 'line',
      data: [],
    },
  ],
};

function initChartHour(canvas, width, height, dpr) {
  chartHour = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chartHour);

  chartHour.setOption(optionHour);

  return chartHour;
}

function initChartMinite(canvas, width, height, dpr) {
  chartMinite = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr, // new
  });
  canvas.setChart(chartMinite);

  chartMinite.setOption(optionMinite);
  return chartMinite;
}

Page({
  onShow() {
    this.getUnerList();
  },
  data: {
    activeUner: '',
    unerList: [],
    curDate: util.formatTime(new Date(), '-'),
    curDateLabel: util.formatTime(new Date(), '-').split(' ')[0],
    activeHour: {},
    ecHour: {
      onInit: initChartHour,
    },
    ecMinite: {
      onInit: initChartMinite,
    },
    hourList: [],
  },
  // 获取Uner列表
  getUnerList() {
    api.get('api/family/uner/optionList', {}, (res) => {
      const data = res || [];
      if (data.length > 0) {
        const item = data[0];
        this.setData({
          unerList: data,
          activeUner: item.sysUnerId,
        });
        this.selectComponent('#tabs').resize();
        this.getHourData();
      }
    });
  },
  // 切换Uner
  onUnerChange(event) {
    this.setData({
      activeUner: event.detail.name,
    });
    this.getHourData();
  },
  // 获取图表数据
  getHourData() {
    const { activeUner, curDate } = this.data;
    api.get(
      'api/family/uner/mark/by-date/info',
      { dateStr: curDate.split(' ')[0], sysUnerId: activeUner },
      (res) => {
        const list = res || [];
        const { xAxis, series } = optionHour;
        xAxis.data = [];
        series[0].data = [];
        series[0].name = [];
        this.data.hourList = list;
        list.forEach((e) => {
          const { startTime, totalNum } = e;
          xAxis.data.push(startTime);
          e.value = totalNum;
          series[0].data.push(e);
        });

        chartHour.dispatchAction({
          type: 'hideTip',
        });

        chartHour.setOption(optionHour);

        // 默认选中第一个
        this.setData({
          activeHour: this.data.hourList[0],
        });
        this.getMiniteData();

        chartHour.on('bindtap', function (param) {
          console.log(param); //这里根据param填写你的跳转逻辑
        });
      }
    );
  },
  getMiniteData() {
    chartMinite.dispatchAction({
      type: 'hideTip',
    });
    const { activeUner, curDate, activeHour } = this.data;
    api.get(
      'api/family/uner/mark/by-time/info',
      {
        dateStr: curDate,
        sysUnerId: activeUner,
        id: activeHour.id,
      },
      (res) => {
        const list = res || [];
        optionMinite.xAxis.data = [];
        optionMinite.series[0].data = [];

        list.forEach((e) => {
          const { serial, num } = e;
          optionMinite.xAxis.data.push(serial);
          optionMinite.series[0].data.push(num);
        });

        chartMinite.setOption(optionMinite);
      }
    );
  },
  // 图表点击事件
  chartClick(params) {
    const { x, y } = params.detail;
    const pointInPixel = [x, y];
    const index = chartHour.convertFromPixel(
      { seriesIndex: 0 },
      pointInPixel
    )[0];
    if (index >= 0) {
      this.setData({
        activeHour: this.data.hourList[index],
      });
      this.getMiniteData();
    }
  },
  // 上一天
  onClickLeft() {
    let { curDate } = this.data;
    let date = new Date(new Date(curDate).getTime() - 24 * 60 * 60 * 1000);
    curDate = util.formatTime(date, '-');
    this.setData({
      curDate,
      curDateLabel: curDate.split(' ')[0],
    });
    this.getHourData();
  },
  // 下一天
  onClickRight() {
    let { curDate } = this.data;
    let date = new Date(new Date(curDate).getTime() + 24 * 60 * 60 * 1000);
    curDate = util.formatTime(date, '-');
    this.setData({
      curDate,
      curDateLabel: curDate.split(' ')[0],
    });
    this.getHourData();
  },
});
