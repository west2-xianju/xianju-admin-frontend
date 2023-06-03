<template>
  <t-form
    ref="form"
    class="base-form"
    :data="formData"
    :rules="FORM_RULES"
    label-align="top"
    :label-width="100"
    @reset="onReset"
    @submit="onSubmit"
  >
    <div class="form-basic-container">
      <div class="form-basic-item">
        <div class="form-basic-container-title">货物信息</div>
        <!-- 表单内容 -->

        <!-- 合同名称,合同类型 -->
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="6">
            <t-form-item label="货物ID" name="user_id">
              <t-input v-model="formData.uid" disabled></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="卖家ID" name="blocked">
              <t-input v-model="formData.seller_id"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="游戏" name="username">
              <t-input v-model="formData.game"></t-input>
            </t-form-item>
          </t-col>

          <t-col :span="4">
            <t-form-item label="状态" name="blocked">
              <t-select v-model="formData.state">
                <t-option label="待审核" value="pending">待审核</t-option>
                <t-option label="已发布" value="released">已发布</t-option>
                <t-option label="已锁定" value="locked">已锁定</t-option>
                <t-option label="已售出" value="sold">已售出</t-option>
                <t-option label="已取消" value="canceled">已取消</t-option>
                <t-option label="已删除" value="deleted">已删除</t-option>
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="价格" name="nickname">
              <t-input v-model="formData.price"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-form-item label="发布时间" name="publish_time">
              <t-date-picker v-model="formData.publish_time" enable-time-picker allow-input clearable />
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="标题" name="username">
              <t-input v-model="formData.title"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="内容详情" name="nickname">
              <t-textarea v-model="formData.detail" :autosize="{ minRows: 3, maxRows: 8 }"></t-textarea>
            </t-form-item>
          </t-col>
        </t-row>
      </div>
    </div>

    <div class="form-submit-container">
      <div class="form-submit-sub">
        <div class="form-submit-left">
          <t-button theme="primary" class="form-submit-confirm" type="submit"> 确认提交 </t-button>
          <t-button type="reset" class="form-submit-cancel" theme="default" variant="base"> 取消 </t-button>
        </div>
      </div>
    </div>
  </t-form>
</template>

<script lang="ts">
export default {
  name: 'FormBase',
};
</script>

<script setup lang="ts">
import { FormRule, MessagePlugin } from 'tdesign-vue-next';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { updateGood } from '@/api/app/good';

const FORM_RULES: Record<string, FormRule[]> = {
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

interface FormData {
  uid?: string;
  good_id?: any;
  seller_id?: string;
  game?: string;
  title?: string;
  detail?: string;
  state?: string;
  publish_time?: string;
  price?: string;
}

const formData = ref<FormData>({});

const onReset = () => {
  MessagePlugin.warning('取消新建');
  router.back();
};

const router = useRouter();
const route = useRoute();

onMounted(() => {
  console.log(route.query);
  formData.value = { ...route.query };
  formData.value.good_id = route.query.uid;
});
const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    try {
      updateGood(formData.value.good_id, formData.value);
    } catch (error) {
      console.log(error);
    } finally {
      MessagePlugin.success('修改成功');
      console.log(formData);
      router.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
