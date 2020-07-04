<template>
  <div class="pane">
    <div
      v-for="(part, $index) of parts"
      class="message"
      :key="$index"
      v-html="displayify(part.content)"
    ></div>
    <div class="input-line">
      <div class="prompt" v-text="prompt"></div>
      <div class="input-area">
        <input
          v-if="showInput()"
          v-model="typedInput"
          ref="input"
          class="input"
          :class="{ 'empty': !typedInput }"
          :type="getInputType()"
          :placeholder="getPlaceholder()"
          v-autofocus
          @keypress.enter="finishInput()"
        />
        <textarea
          v-if="showTextarea()"
          v-model="typedText"
          ref="textarea"
          class="textarea"
          :placeholder="getPlaceholder()"
          rows="10"
          v-autofocus
          @keypress.enter="finishText()"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import cli, { InputType, Prompt } from "../services/cli";
import autofocus from "../directives/autofocus";
import displayFormatter from "../services/displayFormatter";

export default {
  data() {
    return {
      inputType: InputType.COMMAND,
      parts: [],
      prompt: Prompt.DEFAULT,
      typedInput: "",
      typedText: ""
    };
  },
  directives: {
    autofocus
  },
  beforeMount() {
    cli.output$.onEvent(parts => {
      this.parts = parts;
    });

    cli.inputType$.onEvent(inputType => {
      this.inputType = inputType;
    });
  },
  methods: {
    displayify(text) {
      return displayFormatter.formatAsHtml(text);
    },
    finishInput() {
      cli.processCommand(this.typedInput);
    },
    finishText() {},
    getInputType() {
      switch (this.inputType) {
        case InputType.PASSWORD:
          return "password";
        default:
          return "text";
      }
    },
    getPlaceholder() {
      switch (this.inputType) {
        case InputType.PASSWORD:
          return "********";
        case InputType.COMMAND:
          return "Type a command";
        case InputType.SHORT:
        case InputType.PARAGRAPH:
          return "Type here";
      }
    },
    showInput() {
      return [InputType.COMMAND, InputType.SHORT, InputType.PASSWORD].includes(
        this.inputType
      );
    },
    showTextarea() {
      return [InputType.PARAGRAPH].includes(this.inputType);
    }
  }
};
</script>

<style lang="scss">
.example-cmd {
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  font-family: "Courier New", Courier, monospace;
  margin: 0 6px;
  padding: 2px 4px;
  white-space: pre;
}

.example-key {
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: -4px 5px 8px -6px rgba(0, 0, 0, 0.51);
  margin: 0 6px;
  padding: 2px 6px;
  text-transform: capitalize;
}
</style>

<style lang="scss" scoped>
@import "../mixins";

.pane {
  max-height: 100%;
  overflow-y: auto;
}

.message {
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
}

.input-line {
  display: flex;
  flex-direction: row;
}

.prompt {
  color: $darkgreen;
  font-weight: bold;
  margin-right: 4px;
}

.input-area {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.input {
  border: none;
  border-bottom: 1px dashed transparent;
  flex: 1;
  font-size: 16px;
  outline: 0;
  position: relative;
  transition: border-bottom-color 250ms, flex 750ms;

  &.empty {
    border-bottom: 1px dashed $darkgreen;
    flex: none;
    width: auto;
  }
}
</style>