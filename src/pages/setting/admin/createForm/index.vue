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
        <div class="form-basic-container-title">管理员信息</div>
        <!-- 表单内容 -->

        <!-- 合同名称,合同类型 -->
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="4">
            <t-form-item label="权限等级" name="level">
              <t-select v-model="formData.level">
                <t-option label="超级管理员" value="superuser">超级管理员</t-option>
                <t-option label="普通管理员" value="admin">普通管理员</t-option>
              </t-select>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="用户名" name="username">
              <t-input v-model="formData.username"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="密码" name="password">
              <t-input v-model="formData.password" placeholder="*********"></t-input>
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { createAdmin } from '@/api/admin/admin';

const FORM_RULES: Record<string, FormRule[]> = {
  admin_id: [{ required: true, message: '请输入管理员ID', type: 'error' }],
  username: [{ required: true, message: '请输入用户名', type: 'error' }],
  password: [{ required: false, message: '请输入密码', type: 'error' }],
};
interface FormData {
  admin_id?: any;
  username?: string;
  level?: string;
  password?: string;
}
const formData = ref<FormData>({});

const onReset = () => {
  MessagePlugin.warning('取消新建');
};

const router = useRouter();

const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    try {
      await createAdmin(formData.value);
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
