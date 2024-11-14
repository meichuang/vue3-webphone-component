<template>
  <div>
    <button @click="showModal = true">打开模态框</button>
    <ModalView :visible="showModal" @close="showModal = false">
      <h2>这是一个模态框</h2>
      <p>你可以在这里添加任何内容。</p>
    </ModalView>
  </div>
</template>

<script>
import ModalView from './ModalView.vue';

export default {
  components: {
    ModalView
  },
  data() {
    return {
      showModal: false
    };
  }
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 50px;
}
</style>