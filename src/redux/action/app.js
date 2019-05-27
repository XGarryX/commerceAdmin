export const CHANGETOKEN = 'CHANGE_TOKEN'  //跟新token
export const UPDATETIME = 'UPDATE_TIME'    //更新操作时间
export const SETTIMEFN = 'SET_TIME_FN'    //设置判断是否超时函数

export const changeToken = value => ({
    type: CHANGETOKEN,
    token: value
})

export const updateTime = time => ({
    type: UPDATETIME,
    time
})

export const setTimeFn = fn => ({
    type: SETTIMEFN,
    fn
})
