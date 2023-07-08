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
        <div class="form-basic-container-title">用户信息</div>
        <!-- 表单内容 -->

        <!-- 合同名称,合同类型 -->
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="7">
            <t-form-item label="用户ID" name="user_id">
              <t-input v-model="formData.user_id"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="5">
            <t-form-item label="封禁状态" name="blocked">
              <t-switch v-model="formData.blocked"></t-switch>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="用户名" name="username">
              <t-input v-model="formData.username"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="昵称" name="nickname">
              <t-input v-model="formData.nickname"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="邮箱" name="email">
              <t-input v-model="formData.email"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-form-item label="真实姓名" name="realname">
              <t-input v-model="formData.realname"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="8">
            <t-form-item label="身份证号" name="id_number">
              <t-input v-model="formData.id_number"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="12">
            <t-form-item label="密码" name="password">
              <t-input v-model="formData.password"></t-input>
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
import isEmail from 'validator/lib/isEmail';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { createUser } from '@/api/app/user';

// import { INITIAL_DATA } from './constants';

const FORM_RULES: Record<string, FormRule[]> = {
  user_id: [{ required: true, message: '请输入用户ID', type: 'error' }],
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  nickname: [{ required: false, message: '请输入昵称', type: 'error' }],
  email: [{ required: true, message: '请输入邮箱', type: 'error' }, { validator: isEmail }],
  realname: [{ required: false, message: '请输入真实姓名', type: 'error' }],
  id_number: [{ required: false, message: '请输入身份证号', type: 'error' }],
  password: [{ required: false, message: '请输入密码', type: 'error' }],
};

const INITIAL_DATA = {
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
const formData = ref({ ...INITIAL_DATA });

const onReset = () => {
  MessagePlugin.warning('取消新建');
};

const router = useRouter();

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    try {
      createUser(formData.value);
    } catch (error) {
      console.log(error);
    } finally {
      MessagePlugin.success('新建成功');
      console.log(formData);
      router.back();
    }
  }
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
