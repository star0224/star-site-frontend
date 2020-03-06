global.constants = {
    server: 'http://116.62.123.56:8080',
    // 有道翻译
    appId: '0529a4e010347b12',
    appKey: 'wfHuv4aPR35Eta1N8w3sPhEPIdIULvNJ',
    // 腾讯位置服务
    tencentKey: 'PHIBZ-WXNOD-O7Y4K-HQUPD-IOE3J-7QBG6'
}

export const loginInfo = {
    isLogin: false,

    logIn(toBack) {
        loginInfo.isLogin = true;
        setTimeout(toBack, 100)
    },
}
