<template>
  <div
    class="img-rotation-div"
    id="imgRotation"
    @mousedown="down($event)"
    @touchstart="down($event)"
    @mousemove="move($event)"
    @touchmove="move($event)"
    @mouseup="end($event)"
    @touchend="end($event)"
  >
    <div v-for="(item, index) in productGrp" :key="index">
      <img
        :src="(item.type === 'normal' ? TestPic: ServerPic)"
        alt
        class="pro-img"
        :style="item.style"
      />
      <span v-html="item.name" :style="item.style" class="pro-name"></span>
    </div>
  </div>
</template>

<script>
import Test from "@/assets/images/test.png";
import testVue from "../../page/small/test.vue";
import serverA from "@/assets/images/server-a.png";
export default {
  name: "",
  props: ["autoMove"],
  mounted() {
    this.initArc();
  },
  data() {
    return {
      AUTOSPEED: 1 / 2,
      productGrp: [
        { name: "长春", type: "normal", style: {}, nameStyle: {} },
        { name: "吉林", type: "normal", style: {}, nameStyle: {} },
        { name: "四平", type: "normal", style: {}, nameStyle: {} },
        { name: "辽原", type: "normal", style: {}, nameStyle: {} },
        { name: "通化", type: "normal", style: {}, nameStyle: {} },
        { name: "白山", type: "normal", style: {}, nameStyle: {} },
        { name: "松原", type: "normal", style: {}, nameStyle: {} },
        { name: "白城", type: "normal", style: {}, nameStyle: {} },
        { name: "延边", type: "normal", style: {}, nameStyle: {} },
        { name: "直属", type: "normal", style: {}, nameStyle: {} }
      ],
      TestPic: Test,
      ServerPic: serverA,
      setAnimate: null,
      speed: 0,
      fun_animat: undefined,
      downDrag: false,
      dragObj: {
        moveX: 0,
        moveY: 0,
        touchstartX: 0,
        touchstartY: 0
      },
      maxItem: undefined,
    };
  },
  computed: {},
  methods: {
    initArc() {
      let container = document.getElementById("imgRotation");
      let imgDiv = container.getElementsByTagName("img");
      //中心点横坐标
      let dotLeft = container.clientWidth / 2 - 100;
      //中心点纵坐标
      let dotTop = container.clientHeight / 2 - 100;
      //椭圆长边
      let a = 200;
      //椭圆短边
      let b = 90;
      //起始角度
      let stard = 0;

      //每一个BOX对应的角度;
      let avd = 360 / imgDiv.length;
      //每一个BOX对应的弧度;
      let ahd = (avd * Math.PI) / 180;
      //运动的速度
      let speed = 2;
      //图片的宽高
      let wid = imgDiv[0].clientWidth;
      let hei = imgDiv[0].clientHeight;
      //总的TOP值
      let totTop = dotTop + 100;

      //设置圆的中心点的位置
      //   $(".dot").css({ left: dotLeft, top: dotTop });

      let that = this;
      //运动函数
      this.fun_animat = function(speed) {
        // speed = speed < 360 ? speed : 2;
        //运运的速度
        // speed += 360;
        //运动距离，即运动的弧度数;
        let ainhd = (speed * Math.PI) / 180;

        //按速度来定位DIV元素
        let maxNum = 0;
        that.productGrp.forEach(function(item, index) {
          let allpers = (Math.cos(ahd * index + ainhd) * b + dotTop) / totTop;
          let wpers = Math.max(0.1, allpers);
          let hpers = Math.max(0.1, allpers);
          item.type = "normal";
          item.style = {
            left: Math.sin(ahd * index + ainhd) * a + dotLeft + "px",
            top: Math.cos(ahd * index + ainhd) * b + dotTop + "px",
            zIndex: Math.ceil(allpers * 10),
            width: wpers * wid + "px",
            height: hpers * hei + "px",
            opacity: allpers
          };
          item.nameStyle = {
            left: Math.sin(ahd * index + ainhd) * a + dotLeft + "px",
            top: Math.cos(ahd * index + ainhd) * b + dotTop + "px",
            opacity: allpers,
            zIndex: Math.ceil(allpers * 10)
          };
          if (item.style.zIndex > maxNum) {
            maxNum = item.style.zIndex;
            that.maxItem = item;
          }
        });
        // 挑选出最前方的一个产品作为当前产品
        // let max = Math.max(...that.productGrp.map(x => x.style.zIndex));

        that.productGrp.forEach((item, index) => {
          item.type = item.name === that.maxItem.name ? "cur" : "normal";
        });
        if (that.autoMove) {
          let prePro = that.$store.state.currentPro;
          if (prePro !== that.maxItem.name) {
            that.$store.commit("newCurrentPro", that.maxItem.name);
          }
        }
      };
      this.setAnimate = setInterval(
        (func, that) => {
          that.speed = that.speed <= 0 ? that.speed - that.AUTOSPEED : 360;
          func(that.speed);
        },
        100,
        this.fun_animat,
        that
      );
    },

    down(e) {
      if (this.autoMove) return;
      this.downDrag = true;
      let mouseType = e.type.indexOf("mouse") !== -1 ? true : false;
      let clientX = mouseType ? e.clientX : e.touches[0].clientX;
      let clientY = mouseType ? e.clientY : e.touches[0].clientY;
      this.dragObj.touchstartX = clientX;
      this.dragObj.touchstartY = clientY;
    },
    move(e) {
      if (this.autoMove) return;
      let mouseType = e.type.indexOf("mouse") !== -1 ? true : false;
      if (mouseType && !this.downDrag) return;
      let clientX = mouseType ? e.clientX : e.touches[0].clientX;
      let clientY = mouseType ? e.clientY : e.touches[0].clientY;
      let preX = this.dragObj.moveX,
        preY = this.dragObj.moveY;

      this.dragObj.moveX += e.movementX;
      this.dragObj.moveY += e.movementY;

      if (!mouseType) {
        this.dragObj.moveX = clientX - this.dragObj.touchstartX;
        this.dragObj.moveY = clientY - this.dragObj.touchstartY;
      }

      // 考虑拖拽时鼠标回拖， 将拖拽点设置为初始坐标
      if (Math.abs(preX) > Math.abs(this.dragObj.moveX)) {
        this.dragObj.touchstartX = clientX;
        this.dragObj.touchstartY = clientY;
      }

      this.speed =
        this.speed <= 360
          ? this.speed + this.dragObj.moveX / 100
          : this.dragObj.moveX / 100;
      this.fun_animat(this.speed);

      // 这里的数据越小，越精确
      if (Math.abs(this.dragObj.moveX) + Math.abs(this.dragObj.moveY) > 5) {
        this.dragging = true;
      }
    },
    end(e) {
      if (this.autoMove) return;
      let prePro = this.$store.state.currentPro;
      if (prePro !== this.maxItem.name) {
        this.$store.commit("newCurrentPro", this.maxItem.name);
      }
      this.downDrag = false;
      this.dragging = false;
      this.dragObj = {
        moveX: 0,
        moveY: 0,
        touchstartX: 0,
        touchstartY: 0
      };
    },

    animateInt() {
      let that = this;
      this.setAnimate = setInterval(
        (func, that) => {
          that.speed = that.speed <= 360 ? that.speed + that.AUTOSPEED : 2;
          func(that.speed);
        },
        100,
        this.fun_animat,
        that
      );
    },
    clearAnimateInt() {
      clearInterval(this.setAnimate);
    }
  },
  components: {},
  watch: {
    autoMove: function(newVal) {
      if (newVal) {
        this.animateInt();
      } else {
        clearInterval(this.setAnimate);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.setAnimate);
    this.setAnimate = null;
  }
};
</script>

<style lang="less" scoped>
.img-rotation-div {
  .pro-img {
    position: absolute;
    width: 65px;
    height: 100px;
  }
  .pro-name {
    position: absolute;
    width: 65px;
    height: 28px;
    font-size: 28px;
    white-space: nowrap;
  }
}
</style>
