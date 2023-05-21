<template>
  <div class="list-common-table">
    <t-input v-model="userId" label="user_id" />
    <t-input v-model="roomId" label="room_id" />
    <t-button @click="onConnectNotification">Connect Notification</t-button>
    <t-button v-if="isConncetedNotification == true" @click="onConnectRoom">Connect chat service</t-button>
    <t-button @click="onJoinRoom">Join room</t-button>
    <t-button @click="onDisconnectRoom">Disconnect</t-button>
    <t-input v-model="userToken" label="userToken" />
    <t-button @click="getUserTokenFromServer">Get Token</t-button>
  </div>

  <div class="list-common-table">
    <t-space size="medium">
      <t-textarea id="chat" v-model="chatLog" :autosize="{ minRows: 20, maxRows: 20 }"></t-textarea>
      <t-textarea v-model="notificationLog" :autosize="{ minRows: 20, maxRows: 20 }"></t-textarea>
    </t-space>
    <t-input v-model="messageContent">input message</t-input>
    <t-button id="send" @click="onSendMessage">Send</t-button>
    <t-button id="debug" @click="onDebugEvent">Debugging</t-button>
    <t-button @click="onPushNotification">Push Notification</t-button>
    <t-button @click="onClear">Clean</t-button>
  </div>
</template>

<script setup lang="ts">
import io from 'socket.io-client';
import { onMounted, ref } from 'vue';

import { getUserToken } from '@/api/app/chat';

const isConncetedNotification = ref(false);
const userId = ref('');
const roomId = ref('');
const userToken = ref('default');
const messageContent = ref('');
const chatLog = ref('');
const notificationLog = ref('');
// const socket = io('http://192.168.1.250:3002/chat', {
//   timeout: 5000,
//   auth: {
//     token: userToken.value,
//   },
//   autoConnect: false,
// });

const baseSocketioUrl = 'http://192.168.1.250:3002';

const socket = io(`${baseSocketioUrl}/chat`, {
  timeout: 5000,
  auth: {
    token: userToken.value,
  },
  autoConnect: false,
});

const socketNotification = io(`${baseSocketioUrl}/notification`, {
  timeout: 5000,
  auth: {
    token: userToken.value,
  },
  autoConnect: false,
});

onMounted(() => {
  socket.on('status', (data) => {
    console.log('status', data);
    // chatLog.value += `${JSON.stringify(data)}\n`;
    chatLog.value += `<info> ${data.msg}\n`;
  });

  socket.on('message', (data) => {
    console.log('message', data);
    // chatLog.value += `${JSON.stringify(data)}\n`;
    chatLog.value += `${data.sender}: ${data.detail}\n`;
  });

  socketNotification.on('status', (data) => {
    console.log('status', data);
    // notificationLog.value += `${JSON.stringify(data)}\n`;
    notificationLog.value += `<info> ${data.msg}\n`;
  });

  socketNotification.on('notification', (data) => {
    console.log('notification', data);
    // notificationLog.value += `${JSON.stringify(data)}\n`;
    notificationLog.value += `<notification> ${data.detail}\n`;
  });
});

const getUserTokenFromServer = async () => {
  const { token } = await getUserToken(userId.value);
  userToken.value = token;
};

const onConnectRoom = () => {
  socket.auth = {
    token: userToken.value,
  };
  socket.disconnect();
  socket.connect();
};

const onJoinRoom = () => {
  socket.emit('join', { room_id: roomId.value });
};

const onSendMessage = () => {
  socket.emit('message', { type: 'plaintext', detail: messageContent.value });
};

const onDebugEvent = () => {
  socket.emit('debug', { msg: messageContent.value });
};

const onConnectNotification = () => {
  socketNotification.auth = {
    token: userToken.value,
  };
  socketNotification.disconnect();
  socketNotification.connect();
  isConncetedNotification.value = true;
};

const onDisconnectRoom = () => {
  socket.disconnect();
  socketNotification.disconnect();
};

const onClear = () => {
  chatLog.value = '';
  notificationLog.value = '';
};

const onPushNotification = () => {
  socketNotification.emit('push', { level: 'plaintext', detail: messageContent.value });
};
</script>

<style lang="less" scoped>
.list-common-table {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}

.form-item-content {
  width: 100%;
}

.operation-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    .t-button__text {
      display: flex;
      align-items: center;
    }
  }
}

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: var(--td-comp-margin-s);
  }
}
</style>
