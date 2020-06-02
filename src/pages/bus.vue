<style lang="less">
  @import "./src/less/config";
  page {
    background-image: url("https://scuplus.oss-cn-shenzhen.aliyuncs.com/bg/bus.png");
    background-position: 50% calc(~"100% + 380rpx");
    background-repeat: no-repeat;
    background-size: 100%;
    background-attachment: fixed;
    color: #3e3c3d;
    padding-top: 90rpx;
  }
  .header {
    top: 0rpx;
    display: flex;
    width: 100%;
    height: 80rpx;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    z-index: 100;
    background: #ab96c5;
    color: @white;
  }
  .timeline {
    position: relative;
    margin: 0 auto;
    padding: 1em 0;
    list-style-type: none;
  }
  .timeline:before {
    position: absolute;
    left: 50%;
    top: 0;
    content: ' ';
    display: block;
    width: 6rpx;
    height: 100%;
    @bg: #857e95;
    margin-left: -3px;
    background: @bg;
    background: linear-gradient(to bottom, #fff 0%, @bg 8%, @bg 92%, #fff 100%);
    z-index: 5;
  }
  .timeline .li {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30rpx;
    height: 80rpx;
    .left {
      width: 300rpx;
      text-align: center;
    }
    .right {
      width: 300rpx;
      text-align: center;
    }
  }
  .timeline .li:before {
    position: absolute;
    content: ' ';
    display: block;
    width: 20rpx;
    height: 20rpx;
    right: calc(~"50% - 10rpx");
    background: #fff;
    border-radius: 20rpx;
    border: 4rpx solid #c3a6cb;
    z-index: 10;
  }
</style>

<template>
  <view>
    <picker @columnchange="columnchange" @change="change" mode="multiSelector" range="{{range}}" range-key="name" value="{{choose}}">
      <view class="header">
        <view class="start">{{range[0][choose[0]].name}}</view>
        <view class="iconfont icon-switch"></view>
        <view class="end">{{range[1][choose[1]].name}}</view>
      </view>
    </picker>
    <scroll-view scroll-y style="height: {{height}}px;" class="timeline">
      <block wx:for="{{bus[chooseStr]}}" wx:key="{{index}}">
        <view class="li">
          <view class="left">{{item.time}}</view>
          <view class="right">{{item.addr}}</view>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
  import wepy from 'wepy'
  import db from 'util/db'
  import DataMixin from 'mixins/data'
export default class Bus extends wepy.page {
    config = {
      navigationBarBackgroundColor: '#ab96c5',
      navigationBarTextStyle: 'white'
    }
    mixins = [DataMixin];
    changeColumn(v) {
      if (v == 0) {
        this.range[1] = [{
          name: '望江',
          value: 2
        }, {
          name: '华西',
          value: 3
        }]
      } else {
        this.range[1] = [{
          name: '江安',
          value: 1
        }]
      }
    }
    methods = {
      change(e) {
        this.choose = e.detail.value
        db.Set('busChoose', this.choose)
      },
      columnchange(e) {
        if (e.detail.column === 0) {
          this.changeColumn(e.detail.value)
        }
      }
    }
    watch = {
      choose(n, o) {
        this.chooseStr = this.range[0][n[0]].value + '-' + this.range[1][n[1]].value
      }
    }
    onLoad() {
      this.choose = db.Get('busChoose') || [0, 0]
      this.changeColumn(this.choose[0])
      this.height = wx.getSystemInfoSync().windowHeight - 80
    }
    data = {
      choose: [0, 0],
      chooseStr: '1-2',
      range: [
        [{
          name: '江安',
          value: 1
        }, {
          name: '望江',
          value: 2
        }, {
          name: '华西',
          value: 3
        }],
        [{
          name: '望江',
          value: 2
        }, {
          name: '华西',
          value: 3
        }]
      ],
      height: 300,
      // 江安: 1, 望江: 2, 华西: 3;
      // 1-2: 江安到望江
      bus: {
        '1-2': [{
          time: '7:10',
          addr: '文星花园 江安花园',
          isFix: false
        },
        {
          time: '7:20',
          addr: '江安点',
          isFix: false
        },
        {
          time: '8:10',
          addr: '文星花园 江安花园',
          isFix: false
        },
        {
          time: '8:20',
          addr: '江安点',
          isFix: false
        },
        {
          time: '8:40',
          addr: '江安点',
          isFix: false
        },
        {
          time: '9:00',
          addr: '江安点',
          isFix: true
        },
        {
          time: '10:15',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '11:20',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '12:10',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '13:00',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '13:25',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '14:00',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '14:55',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '15:45',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '16:35',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '17:10',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '17:30',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '17:50',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '18:30',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '18:50',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '19:00',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '20:00',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '21:20',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '22:15',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '22:30',
          addr: '一基楼',
          isFix: true
        }
        ],
        '2-1': [{
          time: '7:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '7:20',
          addr: '望江',
          isFix: true
        },
        {
          time: '7:30',
          addr: '望江',
          isFix: true
        },
        {
          time: '7:40',
          addr: '望江',
          isFix: false
        },
        {
          time: '7:50',
          addr: '望江',
          isFix: true
        },
        {
          time: '8:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '8:20',
          addr: '望江',
          isFix: true
        },
        {
          time: '9:00',
          addr: '望江',
          isFix: true
        },
        {
          time: '10:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '10:50',
          addr: '望江',
          isFix: false
        },
        {
          time: '11:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '12:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '12:30',
          addr: '望江',
          isFix: false
        },
        {
          time: '13:00',
          addr: '望江',
          isFix: true
        },
        {
          time: '13:55',
          addr: '望江',
          isFix: true
        },
        {
          time: '14:30',
          addr: '望江',
          isFix: false
        },
        {
          time: '15:00',
          addr: '望江',
          isFix: true
        },
        {
          time: '15:30',
          addr: '望江',
          isFix: false
        },
        {
          time: '15:45',
          addr: '望江',
          isFix: true
        },
        {
          time: '16:50',
          addr: '望江',
          isFix: true
        },
        {
          time: '17:20',
          addr: '望江',
          isFix: true
        },
        {
          time: '18:00',
          addr: '望江 到文星花园',
          isFix: true
        },
        {
          time: '18:15',
          addr: '望江',
          isFix: true
        },
        {
          time: '18:50',
          addr: '望江 到文星花园',
          isFix: true
        },
        {
          time: '19:30',
          addr: '望江 到文星花园',
          isFix: true
        },
        {
          time: '20:30',
          addr: '望江',
          isFix: true
        },
        {
          time: '21:10',
          addr: '望江',
          isFix: true
        },
        {
          time: '21:40',
          addr: '望江',
          isFix: true
        },
        {
          time: '22:30',
          addr: '望江',
          isFix: true
        }
        ],
        '1-3': [{
          time: '8:20',
          addr: '江安点',
          isFix: true
        },
        {
          time: '8:40',
          addr: '江安点',
          isFix: true
        },
        {
          time: '9:00',
          addr: '江安点',
          isFix: true
        },
        {
          time: '10:15',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '12:10',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '13:00',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '14:55',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '15:45',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '16:35',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '17:20',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '17:50',
          addr: '行政楼',
          isFix: true
        },
        {
          time: '18:30',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '18:50',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '19:40',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '21:20',
          addr: '一基楼',
          isFix: true
        },
        {
          time: '22:15',
          addr: '一基楼 江安-华西-望江',
          isFix: true
        }
        ],
        '3-1': [{
          time: '7:15',
          addr: '华西',
          isFix: true
        },
        {
          time: '7:40',
          addr: '华西',
          isFix: false
        },
        {
          time: '9:10',
          addr: '华西',
          isFix: true
        },
        {
          time: '10:00',
          addr: '华西',
          isFix: false
        },
        {
          time: '11:10',
          addr: '华西',
          isFix: true
        },
        {
          time: '12:10',
          addr: '华西',
          isFix: false
        },
        {
          time: '13:00',
          addr: '华西',
          isFix: true
        },
        {
          time: '13:55',
          addr: '华西',
          isFix: true
        },
        {
          time: '14:50',
          addr: '华西',
          isFix: false
        },
        {
          time: '15:40',
          addr: '华西',
          isFix: true
        },
        {
          time: '16:50',
          addr: '华西',
          isFix: true
        },
        {
          time: '17:20',
          addr: '华西',
          isFix: true
        }, {
          time: '17:50',
          addr: '华西 到文星花园',
          isFix: false
        },
        {
          time: '18:15',
          addr: '华西',
          isFix: true
        },
        {
          time: '19:30',
          addr: '华西',
          isFix: true
        }
        ]
      }
    }
  }
</script>
