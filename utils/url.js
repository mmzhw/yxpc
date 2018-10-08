// let baseURL = 'https://dxapi.youxiang0210.com';// 正式永久服务器
let baseURL = 'http://daxiangapi.youxiang0210.com';// 正式临时服务器
let imgPrefix = 'https://image.youxiang0210.com/';
let videoPrefix = 'https://video.youxiang0210.com/';

/* 对应命令 start */
if (process.env.NODE_ENV === 'production') {
    baseURL = 'http://daxiangapi.youxiang0210.com';
}

/* 对应命令start:dev */
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://test.dxapi.youxiang0210.com/';
}

module.exports = {
    baseURL,
    imgPrefix,
    videoPrefix
};
