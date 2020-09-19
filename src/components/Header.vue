<template>
  <header class="toolbar toolbar-header">
    <div class="toolbar-actions">
      <div class="btn-group">
        <router-link class="btn btn-default" to="/"><span class="icon icon-menu"></span></router-link>
        <router-link class="btn btn-default" to="/settings"><span class="icon icon-tools"></span></router-link>

        <tracker/>
      </div>

    </div>

  </header>
</template>

<script>
import Tracker from "@/components/Tracker";

export default {

name: "app-header",
  components: {
    Tracker
  }

}
</script>

<style scoped>

.btn-group {
  width: 100%;
}
</style>
