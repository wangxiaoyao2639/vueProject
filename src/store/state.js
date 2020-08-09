export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    dialogVisible: false,
    dialogData: {},
    currentPro: '全省',
    amplification: {},
    visual: {},

    shiJudge: false,
    wholeJudge: true,
    middleJudge: false,

    // 存储一屏数据
    screenFirstData: {},
    leftSecAux: {},
    projectCondition: {},

    // 排序
    S1Sort: ['本部', '长春', '吉林', '四平', '通化', '延边', '白城', '辽源', '白山', '松原', '直属']
}
