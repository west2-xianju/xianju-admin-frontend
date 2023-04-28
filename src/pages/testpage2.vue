<template>
  <div class="list-common-table">
    <t-form
      ref="form"
      :data="formData"
      :layout="inline"
      colon
      scroll-to-first-error="smooth"
      label-align="top"
      @reset="onReset"
      @submit="onSubmit"
    >
      <t-row justify="space-between" class="form-basic-item">
        <div>
          <t-button theme="primary">
            <template #icon><add-icon /></template>
            新建用户
          </t-button>
          <t-button theme="default" variant="outline"
            ><template #icon><refresh-icon /></template>
            刷新列表
          </t-button>
        </div>
        <div>
          <t-button theme="primary" type="submit">查询</t-button>
          <t-button theme="default" variant="outline" type="reset">重置</t-button>
        </div>
      </t-row>

      <div class="form-basic-item">
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="4">
            <t-form-item label="用户ID" name="user_id">
              <t-input v-model="formData.user_id"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-form-item label="用户名" name="username">
              <t-input v-model="formData.username"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-form-item label="昵称" name="nickname">
              <t-input v-model="formData.nickname"></t-input>
            </t-form-item>
          </t-col>
        </t-row>
        <t-row class="row-gap" :gutter="[32, 24]">
          <t-col :span="4">
            <t-form-item label="邮箱" name="email">
              <t-input v-model="formData.email"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="2">
            <t-form-item label="真实姓名" name="realname">
              <t-input v-model="formData.realname"></t-input>
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item label="身份证号" name="id_number">
              <t-input v-model="formData.id_number"></t-input>
            </t-form-item>
          </t-col>
        </t-row>
      </div>

      <!-- <t-form-item label="封号状态" label-align="left" name="blocked">
        <t-switch v-model="formData.blocked" size="large" :label="['是', '否']"></t-switch>
      </t-form-item> -->
    </t-form>
  </div>
</template>
<script setup>
import { AddIcon, RefreshIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { reactive, ref } from 'vue';

import { getUserList } from '@/api/app/user';

const searchForm = {
  user_id: '',
  username: '',
  nickname: '',
  email: '',
  blocked: '',
  realname: '',
  id_number: '',
};

// const formData = ref({ ...searchForm });
const formData = reactive({ ...searchForm });
const data = ref([]);

const onReset = () => {
  MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }) => {
  console.log(formData);
  if (validateResult === true) {
    // MessagePlugin.info('查询中...');
    data.value = getUserList(formData).then((res) => {
      console.log(res);
      return res;
    });

    MessagePlugin.success('查询成功');
  } else {
    console.log('Validate Errors: ', firstError, validateResult);
    MessagePlugin.warning(firstError);
  }
};
</script>

<style lang="less" scoped>
@import url('./testpage.less');
</style>
