global.constants = {
    server: 'http://localhost:8080',
}

export const loginInfo = {
    isLogin: false,

    logIn(toBack) {
        loginInfo.isLogin = true;
        setTimeout(toBack, 100)
    },
}