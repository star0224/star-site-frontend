global.constants = {
    server: 'http://116.62.123.56:8080',
}

export const loginInfo = {
    isLogin: false,

    logIn(toBack) {
        loginInfo.isLogin = true;
        setTimeout(toBack, 100)
    },
}