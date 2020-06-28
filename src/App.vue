<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>
export default {
    name:"App"
}
</script>

<style>
@import "assets/css/base.css";
#app,html,body{
  background-color: #2b4b6b;
  width: 100%;
  height: 100%;
}
</style>
