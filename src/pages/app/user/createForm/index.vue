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
            <t-form-item label="密码" name="realname">
              <t-input v-model="formData.password"></t-input>
            </t-form-item>
          </t-col>
        </t-row>

        <t-col :span="6">
          <t-form-item label="上传文件" name="files">
            <t-upload
              v-model="formData.files"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              tips="请上传pdf文件，大小在60M以内"
              :size-limit="{ size: 60, unit: 'MB' }"
              :format-response="formatResponse"
              :before-upload="beforeUpload"
              @fail="handleFail"
            >
              <t-button class="form-submit-upload-btn" variant="outline"> 上传合同文件 </t-button>
            </t-upload>
          </t-form-item>
        </t-col>
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
import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { FORM_RULES, INITIAL_DATA } from './constants';

const formData = ref({ ...INITIAL_DATA });

const onReset = () => {
  MessagePlugin.warning('取消新建');
};

const router = useRouter();

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    MessagePlugin.success('新建成功');
    router.back();
  }
};
const beforeUpload = (file) => {
  if (!/\.(pdf)$/.test(file.name)) {
    MessagePlugin.warning('请上传pdf文件');
    return false;
  }
  if (file.size > 60 * 1024 * 1024) {
    MessagePlugin.warning('上传文件不能大于60M');
    return false;
  }
  return true;
};
const handleFail = ({ file }) => {
  MessagePlugin.error(`文件 ${file.name} 上传失败`);
};
// 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
const formatResponse = (res) => {
  return { ...res, error: '上传失败，请重试', url: res.url };
};
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
