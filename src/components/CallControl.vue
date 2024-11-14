<template>
  <div class="btcontainer">
    <button style="
        width: 50px;
        height: 30px;
        border-radius: 10px;
        align-items: center;
      " @click="onRegisterButtonClick">
      注册
    </button>

    <button style="
        width: 80px;
        height: 30px;
      "
      :class="buttonClass" 
      @click="onCallButtonClick"  
      :disabled="isDisabled">
      {{ buttonText }}
    </button>
  </div>
</template>

<script>
import { ref, onMounted, markRaw } from 'vue';
import JsSIP from "jssip";

export default {
  name: "CallControl",
  data() {
    return { 
      callStatus: ref('unavailable'), // 初始状态为不可用
      userAgent: null 
    };
  },
  props: {
    wslAddr: String,
    sipUrl: String,
    password: String,
    callNumber: String
  },
  computed: {
    buttonClass() {
      switch (this.callStatus) {
        case 'unavailable':
          return 'gray-button';
        case 'available':
          return 'green-button';
        case 'in-progress':
         return 'red-button';
        case 'success':
          return 'red-button';
        default:
          return '';
      }
    },
    buttonText() {
      switch (this.callStatus) {
        case 'unavailable':
          return '不可用';
        case 'available':
          return '呼叫';
        case 'in-progress':
          return '接续中';
        case 'success':
          return '挂断';
        default:
          return '';
      }
    },
    isDisabled() {
      return this.callStatus === 'unavailable';
    },
  },
  methods: {
    initializeData() {
      console.log("User agent initialized");
      console.log(this.siwslAddrpUrl);

      const socket = new JsSIP.WebSocketInterface(this.wslAddr);

      const configuration = {
        sockets: [socket],
        uri: this.sipUrl,
        password: this.password,
        session_timers: false,
      };

      this.userAgent = markRaw(new JsSIP.UA(configuration));
      this.register();
    },
    onRegisterButtonClick() {
      this.register();
    },
    
    register() {
      console.log("Registering...");
      if (this.userAgent) {
        this.userAgent.on("registered", (e) => {
          console.log("Registered");
          this.callStatus='available';
        });

        this.userAgent.on("unregistered", (e) => {
          console.log("Unregistered");
        });

        this.userAgent.on("registrationFailed", (e) => {
          console.error("Registration failed:", e);
        });

        //处理入呼
        this.userAgent.on("newRTCSession", (session) => {
          if (session.session.direction === "outgoing") {
            console.log("这是一个呼出会话");
            // 处理呼出会话的逻辑
          } else if (session.session.direction === "incoming") {
            console.log("这是一个呼入会话");
            handleIncomingCall(session.session);
          }
        });

        this.userAgent.start();        
      }

    },

    handleIncomingCall(session) {
      // 例如，弹出一个通知或显示一个对话框让用户选择是否接听
      const answerCall = confirm("您有一个来电，是否接听？");

      if (answerCall) {
        // 接听电话
        this.callStatus = 'success'; 
        session.answer();

        session.on("progress", (response) => {
          console.log("呼叫正在建立中");
        });

        session.on("confirmed", (response) => {
          console.log("呼叫已确认");
        });

        session.on("failed", (response, cause) => {
          console.log("呼叫失败:", cause);
        });
      } else {
        // 拒绝电话
        session.reject();
      }
    },
    onCallButtonClick(button) {
      console.log("callStatus = ", this.callStatus);
      if (this.callStatus === 'in-progress' || this.callStatus === 'success') {
        this.hangUp();
      }
      else if (this.callStatus === 'available') {
        this.callOut();
      }
      else if (this.callStatus === 'unavailable') {
        this.register();
      }
      else {
        console.log("do nothing...");
      }
    },
    callOut() {
      if (this.userAgent) {
        // Register callbacks to desired call events
        var eventHandlers = {
          progress: function (data) {
            console.log("Call is in progress");
            this.callStatus = 'in-progress'; 
          },
          failed: function (data) {
            console.error("Call failed:", data);
            this.callStatus = 'available';  // 呼叫失败
          },
          confirmed: function (data) {
            console.log("Call accepted");
            this.callStatus = 'success';
          },
          ended: function (data) {
            console.log("Call ended");
            this.callStatus = 'available'; // 呼叫挂断
          },
        };

        var options = {
          eventHandlers: eventHandlers,
          extraHeaders: ["X-Foo: foo", "X-Bar: bar"],
          mediaConstraints: { audio: true, video: false },
        };

        console.log("Call: " + this.callNumber);
        this.callStatus = 'in-progress'; // 开始呼叫
        const session = this.userAgent.call(this.callNumber, options);
      } else {
        console.error("User agent is not initialized");        
      }
    },
    hangUp() {
      this.callStatus = 'available'; // 挂断呼叫
      if (this.userAgent) {
        this.userAgent.stop();
      } else {
        console.error("User agent is not initialized");
      }
    },
  },
  created() {
    console.log("组件已创建，自执行函数运行:");
    // 在这里可以执行一些初始化逻辑
    
    this.initializeData();
  },
  
};

</script>

<style scoped>
.btcontainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
}

.gray-button {
  background-color: gray;
  color: white;
  /*padding: 10px 20px;
    border: none; */
  border-radius: 10px;
  cursor: pointer;
}

.green-button {
  background-color: green;
  color: white;
  /*padding: 10px 20px;
    border: none; */
  border-radius: 10px;
  cursor: pointer;
}

.red-button {
  background-color: red;
  color: white;
  /*padding: 10px 20px;
    border: none; */
  border-radius: 10px;
  cursor: pointer;
}
</style>
