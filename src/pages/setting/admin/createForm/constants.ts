import { FormRule } from 'tdesign-vue-next';

export const FORM_RULES: Record<string, FormRule[]> = {
  admin_id: [{ required: true, message: '请输入管理员ID', type: 'error' }],
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  password: [{ required: false, message: '请输入密码', type: 'error' }],
};

export const INITIAL_DATA = {
  user_id: '',
  username: '',
  nickname: '',
  email: '',
  realname: '',
  id_number: '',
  password: '',
  blocked: false,
  // files: [],
};

export const TYPE_OPTIONS = [
  { label: '类型A', value: '1' },
  { label: '类型B', value: '2' },
  { label: '类型C', value: '3' },
];
