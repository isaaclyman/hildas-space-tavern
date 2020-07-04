<template>
  <div>
    <div class="cli">
      <CliPane></CliPane>
    </div>
    <div class="sidebar"></div>
  </div>
</template>

<script>
import CliPane from "./CliPane";
import cli, { BlockPrefix } from "../services/cli";

export default {
  components: {
    CliPane
  },
  mounted() {
    cli.addMessage(
      `Welcome! If you're new here, type [${BlockPrefix.COMMAND}:help] [${BlockPrefix.KEY}:enter] to learn how to begin.`
    );
  }
};
</script>

<style>
</style>