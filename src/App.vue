<template>
  <div id="app">

    <app-header/>
    <redmine-tabs/>
    <div class="window-content">

      <router-view/>
    </div>

  </div>
</template>
<script>
import AppHeader from "@/components/Header";
import RedmineTabs from "@/components/RedmineTabs";

export default {
  name: 'App',
  components: {
    AppHeader,
    RedmineTabs
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

  max-height: calc(100vh - 70px);
}

</style>
