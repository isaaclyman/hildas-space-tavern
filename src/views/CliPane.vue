<template>
  <div class="pane">
    <div v-for="(part, $index) of parts" class="message" :key="$index">
      <div v-if="part.type === PartType.MESSAGE" v-html="displayify(part.content)"></div>
      <div v-if="part.type === PartType.HISTORICAL" class="input-line">
        <div class="prompt" v-text="Prompt.DEFAULT"></div>
        <div class="input-area">
          <span class="input" v-text="part.content"></span>
        </div>
      </div>
      <div v-if="part.type === PartType.TABLE">
        <table class="table-message">
          <thead>
            <tr>
              <th v-for="(cell, $index) of part.content[0]" :key="$index" v-text="cell"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, $index) of part.content.slice(1)" :key="$index">
              <td v-for="(cell, $index) of row" :key="$index" v-text="cell"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="input-line">
      <div class="prompt" v-text="currentPrompt"></div>
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
import cli, { InputType, Prompt, PartType } from "../services/cli";
import autofocus from "../directives/autofocus";
import displayFormatter from "../services/displayFormatter";

export default {
  data() {
    return {
      inputType: InputType.COMMAND,
      parts: [],
      PartType: PartType,
      Prompt: Prompt,
      currentPrompt: Prompt.DEFAULT,
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
      this.typedInput = "";
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
  display: inline-block;
  font-family: "Courier New", Courier, monospace;
  margin: 0 6px;
  padding: 2px 4px;
  white-space: pre;
}

.example-key {
  background-color: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: -2px 2px 0px 0px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin: 0 4px;
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

.table-message {
  border-collapse: collapse;
  margin: 0 6px;

  th,
  td {
    border: 1px dashed $darkgreen;
  }

  th {
    padding: 8px 14px;
  }

  td {
    padding: 6px 14px;
  }
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