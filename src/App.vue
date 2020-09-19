<template>
  <div id="app">

    <app-header/>
    <div class="window-content">

      <router-view/>
    </div>

  </div>
</template>
<script>
import AppHeader from "@/components/Header";

export default {
  name: 'App',
  components: {
    AppHeader
  },
}
</script>


<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #333;
  height: 100%;
  background: #eee;
}

#app .window-content {

  max-height: calc(100vh - 35px);
}

</style>
