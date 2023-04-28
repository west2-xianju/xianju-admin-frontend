import { defineStore } from 'pinia';

import { getUserRole, loginAdmin } from '@/api/auth';
import { TOKEN_NAME } from '@/config/global';
import { store, usePermissionStore } from '@/store';

const InitUserInfo = {
  username: '',
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_NAME) || 'main_token', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo: Record<string, unknown>) {
      // const mockLogin = async (loginResponse: Record<string, unknown>) => {
      //   console.log('Login response', loginResponse);

      //   console.log(`用户信息:`, loginResponse);

      //   登录请求流程
      //   const { account, password } = userInfo;
      //   if (account !== 'td') {
      //     return {
      //       code: 401,
      //       message: '账号不存在',
      //     };
      //   }
      //   if (['main_', 'dev_'].indexOf(password) === -1) {
      //     return {
      //       code: 401,
      //       message: '密码错误',
      //     };
      //   }
      //   const token = {
      //     main_: 'main_token',
      //     dev_: 'dev_token',
      //   }[password];
      //   return {
      //     code: 200,
      //     message: '登陆成功',
      //     data: 'main_token',
      //   };
      // };

      // const res = await mockLogin(loginResponse);
      console.log('user form', userInfo);

      // const res = await loginAdmin(userInfo);
      await loginAdmin(userInfo).then((res) => {
        localStorage.setItem(TOKEN_NAME, res.token);
        this.token = res.token;
      });
      // if (res.code === 200) {
      //   this.token = res.data;
      // } else {
      //   throw res;
      // }
    },
    async getUserInfo() {
      // const mockRemoteUserInfo = async (token: string) => {
      //   if (token === 'main_token') {
      //     return {
      //       name: 'td_main',
      //       roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //     };
      //   }
      //   return {
      //     name: 'td_dev',
      //     roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //   };
      // };
      const res = await getUserRole({ token: this.token });
      // const res = await mockRemoteUserInfo(this.token);
      localStorage.setItem('username', res.username);
      this.userInfo = res;
    },
    async logout() {
      localStorage.removeItem(TOKEN_NAME);
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
    async removeToken() {
      this.token = '';
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
  },
});

export function getUserStore() {
  return useUserStore(store);
}
