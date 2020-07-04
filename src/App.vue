<template>
  <div id="app">
    <div class="title-bar">Hilda's Space Tavern (Version 0.0.1)</div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <span>(c) 2020 by</span>
      <a class="disguised" href="http://isaaclyman.com">no one of importance</a>
    </div>
  </div>
</template>


<style lang="scss">
@import "./mixins";

html,
body {
  font-family: "Hind Madurai", sans-serif;
  font-size: 16px;
  height: 100vh;
  padding: 0;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.title-bar {
  @include flex-vcenter();
  @include natural-border();
  @include natural-shadow();

  align-items: center;
  background-color: $darkgreen;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  color: #fff;
  display: flex;
  font-size: 18px;
  font-weight: 500;
  height: 32px;
  margin-top: 0;
  padding: 6px 16px;
}

.main {
  flex: 1;
  padding: 16px;
}

.footer {
  @include flex-vcenter();
  @include natural-border();

  height: 32px;
  padding: 6px 16px;
}

a.disguised {
  color: black;
  padding: 0 4px;
  text-decoration: none;
}
</style>
