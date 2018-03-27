<style lang="less">
  @import "./src/less/config";
  page {
    padding: 0 20rpx 20rpx 20rpx;
    width: calc(~"100% - 40rpx");
  }
  movable-area {
    width: 100%;
    height: 80rpx;
    movable-view {
      display: block;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #555;
    font-size: 28rpx;
    margin-top: 30rpx;
    .edit {
      color: @base-color;
      border: 2rpx solid @base-color;
      padding: 4rpx 8rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      &.active {
        background: @base-color;
        color: #fff;
      }
    }
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    .item {
      color: #333;
      border: 2rpx solid #ddd;
      padding: 8rpx 30rpx;
      border-radius: 30rpx;
      margin-right: 20rpx;
      margin-top: 20rpx;
      display: flex;
      align-items: baseline;
      .iconfont {
        color: #aaa;
        font-size: 28rpx;
        margin-right: 4rpx;
        display: none;
        &.show {
          display: flex;
        }
      }
      &.all {
        color: @base-color;
      }
    }
  }
</style>

<template>
  <view>
    <view class="title">
      <view>我的栏目</view>
      <view @tap="activeHandle" class="edit {{active ?  'active' : ''}}">编辑</view>
    </view>
    <view class="items">
      <view class="item all">全部</view>
      <block wx:for="{{choose}}" wx:key="{{index}}">
        <view @tap="delete({{item}})" class="item">
          <view class="iconfont icon-shanchu {{active ? 'show' : ''}}"></view>
          <view class="name">{{item.name}}</view>
        </view>
      </block>
    </view>
    <view class="title">
      机构
    </view>
    <view class="items">
      <block wx:for="{{org}}" wx:key="{{index}}">
        <view @tap="add({{item}},org)" class="item">
          <view class="iconfont icon-add {{active ? 'show' : ''}}"></view>
          <view class="name">{{item}}</view>
        </view>
      </block>
    </view>
    <view class="title">
      标签
    </view>
    <view class="items">
      <block wx:for="{{tags}}" wx:key="{{index}}">
        <view @tap="add({{item}},tags)" class="item">
          <view class="iconfont icon-add {{active ? 'show' : ''}}"></view>
          <view class="name">{{item}}</view>
        </view>
      </block>
    </view>
    <view class="title">
      学院
    </view>
    <view class="items">
      <block wx:for="{{college}}" wx:key="{{index}}">
        <view @tap="add({{item}},college)" class="item">
          <view class="iconfont icon-add {{active ? 'show' : ''}}"></view>
          <view class="name">{{item}}</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
  import wepy from "wepy";
  import HttpMixin from "mixins/http";
  import ToastMixin from "mixins/toast";
  import DataMixin from "mixins/data";
  import db from "util/db"
  Array.prototype.removeVal = function(val) {
    const index = this.indexOf(val);
    if (index > -1) {
      this.splice(index, 1);
    }
  }
  export default class ChooseTags extends wepy.page {
    config = {
      navigationBarTitleText: "选择标签",
    };
    mixins = [HttpMixin, ToastMixin, DataMixin];
    data = {
      active: false,
      tags: ["社团活动", "本科教育", "研究生教育", "科研动态", "院内动态", "院内通知", "会议通知", "院系风采", "团情快讯", "热门", "最近", "川大在线", "新闻", "公告", "比赛", "挑战杯", "凤凰展翅", "宣讲会", "招聘信息", ],
      college: ["材料科学与工程学院", "电气信息学院", "电子信息学院", "法学院", "高分子科学与工程学院", "公共管理学院", "华西公共卫生学院", "华西口腔医学院", "华西临床医学院", "华西药学院", "化学学院", "化学工程学院", "华西基础医学与法医学院", "计算机学院", "建筑与环境学院", "经济学院", "匹兹堡学院", "历史文化学院", "轻纺与食品学院", "软件学院", "商学院", "生命科学学院", "数学学院", "水利水电学院", "外国语学院", "文学与新闻学院", "物理科学与技术学院", "艺术学院", "制造科学与工程学院"],
      org: ["青春川大", "教务处", "四川大学新闻网", "就业网", "学工部", "社团联", "研究生院"],
      choose: [{
        name: "青春川大",
        type: "org"
      }]
    }
    methods = {
      activeHandle() {
        this.active = !this.active
      },
      add(item, type) {
        if (!this.active) {
          return
        }
        if (this.choose.length > 10) {
          this.ShowToast("最多十个")
          return
        }
        this[type].removeVal(item)
        this.choose.push({
          name: item,
          type: type
        })
        db.Set("chooseTags", this.choose)
      },
      delete(item) {
        if (!this.active) {
          return
        }
        for (let i = 0; i < this.choose.length; i++) {
          if (this.choose[i].name == item.name) {
            this.choose.splice(i, 1);
          }
        }
        this[item.type].unshift(item.name)
        db.Set("chooseTags", this.choose)
      }
    }
    onLoad() {
      this.choose = db.Get("chooseTags") || this.choose
      this.choose.forEach(e => {
        this[e.type].removeVal(e.name)
      });
    }
  }
</script>
