<template>
  <div class="web-phone">
      <DialPan wslAddr="ws://localhost:8888" sipUrl="sip:1001@localhost" password="1001"></DialPan>
   </div>
</template>

<script>
import DialPan from './DialPan.vue';


export default {
  name: 'web-phone',
  props: {
    msg: String
  },

  components: {
    DialPan    
  },

  data: function() {
    return {
      call: null,
      callState: null,
      callerId: null,
      callerIdName: null,
      callerIdNumber: null,
      callerIdType: null,
      callerIdDisplayName: null,
      callerIdDisplayNumber: null,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
