import { FormRule } from 'tdesign-vue-next';

export const FORM_RULES: Record<string, FormRule[]> = {
  user_id: [{ required: true, message: '请输入用户ID', type: 'error' }],
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  nickname: [{ required: true, message: '请输入昵称', type: 'error' }],
  email: [{ required: true, message: '请输入邮箱', type: 'error' }],
  realname: [{ required: true, message: '请输入真实姓名', type: 'error' }],
  id_number: [{ required: true, message: '请输入身份证号', type: 'error' }],
  password: [{ required: true, message: '请输入密码', type: 'error' }],
};

export const INITIAL_DATA = {
  user_id: '',
  username: '',
  nickname: '',
  email: '',
  realname: '',
  id_number: '',
  password: '',
  files: [],
};

export const TYPE_OPTIONS = [
  { label: '类型A', value: '1' },
  { label: '类型B', value: '2' },
  { label: '类型C', value: '3' },
];
