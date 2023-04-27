<template>
  <t-button @click="apiTestFunction()"> hi </t-button>
  <t-input v-model="data"></t-input>
</template>

<script setup lang="ts">
// import { MessagePlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

const data = ref([]);
// const result = ref('');
// import {get}
// import { testFunction } from '@/api/user';
// import style from '@/config/style';
import { request } from '@/utils/request';

function apiTestFunction() {
  // MessagePlugin.success('call function');
  request.get({ url: '/users/hi' }).then((res) => {
    console.log(res);
    data.value = res.hello;
  });
}
</script>
