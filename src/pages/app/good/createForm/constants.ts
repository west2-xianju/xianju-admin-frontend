import { FormRule } from 'tdesign-vue-next';

export const FORM_RULES: Record<string, FormRule[]> = {
  good_id: [{ required: true, message: '请输入商品ID', type: 'error' }],
  seller_id: [{ required: true, message: '请输入卖家ID', type: 'error' }],
  title: [{ required: true, message: '请输入商品标题', type: 'error' }],
  state: [{ required: true, message: '请输入商品状态', type: 'error' }],
  detail: [{ required: true, message: '请输入商品详情', type: 'error' }],
  price: [
    { required: true, message: '请输入商品价格', type: 'error' },
    { pattern: /^\d+$/, message: '请输入数字' },
  ],
  publish_time: [{ required: true, message: '请输入发布时间', type: 'error' }],
};

export const INITIAL_DATA = {
  uid: '',
  good_id: '',
  seller_id: '',
  title: '',
  state: '',
  game: '',
  detail: '',
  price: '',
  publish_time: '',
};

export const TYPE_OPTIONS = [
  { label: '类型A', value: '1' },
  { label: '类型B', value: '2' },
  { label: '类型C', value: '3' },
];
