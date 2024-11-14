<template>
  <div class="container" @click="handleClick">
    <div class="input-container">
      <input type="text"  @focus="showDialPan" @keyup="handleKeyUp" class="input-field" v-model="callNumber" />
    </div>
   
    <div class="dialpan-container" v-show="isDialPanVisible">
      <div class="row" v-for="(row, index) in dialPan" :key="index">
        <button v-for="KeyNumber in row" :key="KeyNumber" @click="onButtonClick(KeyNumber)">
          {{ KeyNumber }}
        </button>
      </div>
      <CallControl ref="callControl" :wslAddr="wslAddr" :sipUrl="sipUrl" :password="password" :callNumber="callNumber"></CallControl>
    </div>
    
  </div>
</template>

<script>
import CallControl from './CallControl.vue';

export default {
  name: 'DialPan',
  components: {
    CallControl,  
  },
  props: {
    wslAddr: String,
    sipUrl: String,
    password: String
  },
    data() {
    return {
      isDialPanVisible: false,
      callNumber: '',
      dialPan: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['*', '0', '#']
      ]
    };
  },
  methods: {
    onButtonClick(button) {
      this.callNumber += button;
    },
    handleClick(event) {
      console.log(event.target);
      
      if (event.target.closest('.container')) {
        // 如果点击的是拨号盘或输入框，则不隐藏拨号盘
        //this.showDialPan();
        console.log('clicked');
        return;
      }
      this.hideDialPan();
    },
    showDialPan() {
      this.isDialPanVisible = true;
    },
    hideDialPan() {
      this.isDialPanVisible = false;
    },
    handleKeyUp(event) {
      
      switch (event.key) {
        case 'Enter':
          this.$refs.callControl.onCallButtonClick('enter');
          break;
        case 'Escape':
          this.hideDialPan();
          break;
        default:
          this.showDialPan();
          break;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClick);
  }
};
</script>

<style scoped>
.container {
  width: 180px; /* 限定拨号盘的宽度 */
  height: 400px; /* 限定拨号盘的高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* height: 30vh; */
}

.input-container {
  margin-bottom: 20px;
}

.input-field {
  width: 160px;
  height: 30px;
  border-radius: 10px;
  text-align: center;
}

.dialpan-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  gap: 10px;
}

button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
</style>