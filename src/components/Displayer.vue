<template>
  <div class="container">
    <input type="text" class="input-field" />
  </div>
</template>

<script>
export default {
  name: 'DisplayerComponent',
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.input-field {
  width: 160px;
  height: 30px;
  border-radius: 10px;
}
</style>