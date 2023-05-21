import io from 'socket.io-client';

const socket = io('http://192.168.1.250:3002/chat', {
  query: { jwt: localStorage.getItem('chat-token') },
  timeout: 5000,

  autoConnect: true,
});
export default socket;
