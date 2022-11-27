<template>
  <div id="app">
    <CountryMaster />
  </div>
</template>

<script>
import CountryMaster from './components/CountryMaster.vue';
export default {
  name: 'App',
  components: {
    CountryMaster
  },
  created() {
    console.log("this.$config: ", this.$config);
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
