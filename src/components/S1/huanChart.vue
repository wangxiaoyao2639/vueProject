<template>
  <div class="huan-chart" :id="ids"></div>
</template>

<script>
// import ringBg from "../../assets/images/material/circle.png";
export default {
  name: "",
  props: ["ids", "chartData"],
  created() {},
  mounted() {
    // this.initChart(this.ids, temp);
    this.initChart(this.ids, this.chartData, this.currentPro);
  },
  data() {
    return {};
  },
  computed: {
    // 切换部门
    currentPro: {
      get: function() {
        return this.$store.state.currentPro;
      },
      set: function(newVal) {
        this.$store.commit("newCurrentPro", newVal);
      }
    }
  },
  methods: {
    initChart(chartId, data, cp) {
      if (!data || JSON.stringify(data) == '"{}"') return;
      let temp = [
        { name: "财务", value: 0 },
        { name: "营销", value: 0 },
        { name: "人资", value: 0 },
        { name: "工程", value: 0 },
        { name: "物资", value: 0 }
      ];
      let type = ["财务", "营销", "人资", "工程", "物资"];

      data.x[0].data.forEach((item, index) => {
        if (item === cp) {
          let num = type.indexOf(data.x[1].data[index]);
          temp[num].value = data.y[0].data[index];
        }
      });

      let myChart = this.$echarts.init(document.getElementById(chartId));
      myChart.setOption({
        color: [
          "#5B4CFF",
          "#00F7FF",
          "#1D9DFA",
          "#0048F1",
          "#48B188",
          "#4A5D73"
        ],
        tooltip: {
          trigger: "item",
          textStyle: {
            color: "rgba(255, 255, 255, 0.8)",
            fontStyle: "normal",
            fontFamily: "微软雅黑",
            fontSize: 52
          },
          backgroundColor: "rgba(70,130,180,0.8)",
          borderColor: "rgba(47,79,79,1)",
          borderWidth: 1,
          padding: [12, 24],
          formatter: function(params) {
            return (
              params.seriesName + "</br>" + params.name + "：" + params.value
            );
          }
        },
        series: [
          {
            name: "问题数",
            color: [
              "#5B4CFF",
              "#00F7FF",
              "#1D9DFA",
              "#0048F1",
              "#48B188",
              "#4A5D73"
            ],
            type: "pie",
            center: ["48%", "50%"],
            radius: ["105", "220"],
            labelLine: {
              normal: {
                length: 15,
                length2: 80,
                lineStyle: {
                  type: "solid",
                  width: 6
                }
              }
            },
            avoidLabelOverlap: true,
            stillShowZeroSum: true,
            minShowLabelAngle: 50,
            label: {
              normal: {
                alignTo: "edge", // label两端对称布局
                //  ECharts v4.6.0 版本起，提供了 'labelLine' 与 'edge' 两种新的布局方式
                margin: 90, // 布局为两端对称时候需要外边距防止图表变形 数值随意不要太大
                distanceToLabelLine: 0, // label距离引导线距离
                formatter: params => {
                  return (
                    "{b| " +
                    params.name +
                    "}  " +
                    "\n" +
                    "{c|" +
                    params.percent.toFixed(1) +
                    "%}"
                  );
                },
                borderWidth: 0,
                borderRadius: 4,
                padding: [0, -60],
                height: 160,
                fontSize: 12,
                align: "left",
                color: "#3494BD",
                rich: {
                  b: {
                    fontSize: 48,
                    lineHeight: 44,
                    color: "rgba(255,255,255,.7)",
                    padding: [15, 0, 5, 0]
                  },
                  c: {
                    fontSize: 50,
                    lineHeight: 44,
                    color: "#fff",
                    padding: [15, 0, 25, 0]
                  }
                }
              }
            },
            data: temp
          },
          {
            type: "pie",

            center: ["48%", "50%"],
            radius: ["235", "239"],
            data: [100],
            color: "rgba(0,187,194,0.5)",
            label: {
              show: false
            }
          },
          {
            type: "pie",
            center: ["48%", "50%"],
            color: "rgba(0,187,194,0.5)",
            radius: ["71", "75"],
            data: [100],
            label: {
              show: false
            }
          }
        ]
      });
    }
  },
  components: {},
  watch: {
    chartData: function(newVal) {
      this.initChart(this.ids, newVal, this.currentPro);
    },
    currentPro: function(newVal) {
      this.initChart(this.ids, this.chartData, newVal);
    }
  }
};
</script>

<style lang="less" scoped>
</style>
