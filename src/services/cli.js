import { Subscribable } from './subscribable'

const PartType = {
  MESSAGE: 'MESSAGE',
  CLIPROMPT: 'CLIPROMPT',
}

export const InputType = {
  PASSWORD: 'PASSWORD',
  COMMAND: 'COMMAND',
  SHORT: 'SHORT',
  PARAGRAPH: 'PARAGRAPH',
}

export const BlockPrefix = {
  COMMAND: 'cmd',
  KEY: 'key',
}

export const Prompt = {
  DEFAULT: 'hilda $',
}

class Cli {
  constructor() {
    this._parts = []
    this.output$ = new Subscribable('CliOutput')

    this._inputType = InputType.COMMAND
    this.inputType$ = new Subscribable('CliInputType')
  }

  addMessage(text) {
    this._createPart(PartType.MESSAGE, text)
  }

  changeInputType(inputType) {
    this._inputType = inputType
    this.inputType$.trigger(inputType)
  }

  processCommand(command) {
    console.log(command)
    switch (command) {
      case 'help':
        this.addMessage('You asked for help!')
    }
  }

  _createPart(type, content) {
    const part = { type, content }
    this._parts.push(part)
    this.output$.trigger(this._parts)
  }
}

export default new Cli()
