import { Subscribable } from './subscribable'
import { createOption } from './cli-helpers'

export const PartType = {
  CLIPROMPT: 'CLIPROMPT',
  HISTORICAL: 'HISTORICAL',
  MESSAGE: 'MESSAGE',
  TABLE: 'TABLE',
}

export const InputType = {
  COMMAND: 'COMMAND',
  PARAGRAPH: 'PARAGRAPH',
  PASSWORD: 'PASSWORD',
  SHORT: 'SHORT',
}

export const BlockPrefix = {
  COMMAND: 'cmd',
  KEY: 'key',
}

export const Prompt = {
  DEFAULT: 'hilda $',
}

const State = {
  NONE: {
    name: 'NONE',
    options: [
      createOption(
        'about',
        'a',
        `Learn what the heck Hilda's Space Tavern is and what you can do here.`
      ),
      createOption(
        'help',
        'h',
        `Get help. (This is what you just did!) You can get here faster by just typing 'h'.`
      ),
      createOption(
        'inbox',
        'i',
        `Check your inbox for updates to stories you've collected or are participating in.`
      ),
      createOption('explore', 'e', `Find a story to read.`),
      createOption(
        'pitches',
        'p',
        `Check out story pitches and bid on a few if you'd like.`
      ),
    ],
  },
  LOGIN: {
    name: 'LOGIN',
    options: [],
  },
}

const Shortcuts = Object.keys(State).reduce((obj, key) => {
  for (const option of State[key].options) {
    obj[`${key}:${option.Shorthand}`] = `${key}:${option.Command}`
  }
  return obj
}, {})

class Cli {
  constructor() {
    this._parts = []
    this.output$ = new Subscribable('CliOutput')

    this._inputType = InputType.COMMAND
    this.inputType$ = new Subscribable('CliInputType')

    this._state = State.NONE
  }

  addMessage(text) {
    this._createPart(PartType.MESSAGE, text)
  }

  addTable(arrayOfObjects) {
    const headers = []
    const arrayOfArrayOfString = arrayOfObjects.map((obj) => {
      const keys = Object.keys(obj).filter((key) =>
        Object.prototype.hasOwnProperty.call(obj, key)
      )
      const values = []
      for (const key of keys) {
        if (!headers.includes(key)) {
          headers.push(key)
        }
      }

      for (const header of headers) {
        const value =
          obj[header] === undefined
            ? ''
            : obj[header] === null
            ? 'N/A'
            : obj[header].toString()
        values.push(value)
      }
      return values
    })
    this._createPart(PartType.TABLE, [headers, ...arrayOfArrayOfString])
    console.log(arrayOfArrayOfString)
  }

  changeInputType(inputType) {
    this._inputType = inputType
    this.inputType$.trigger(inputType)
  }

  processCommand(command) {
    this._createPart(PartType.HISTORICAL, command)

    const fullCommand = `${this._state.name}:${command}`
    switch (Shortcuts[fullCommand] || fullCommand) {
      case `${State.NONE.name}:help`:
        this.addMessage(
          `Happy to help! Here's a list of commands you can type to get around, read a story, or create something of your own.`
        )
        this.addTable(this._state.options)
        break
      default:
        this.addMessage(`Sorry, I didn't understand that command!`)
    }
  }

  _createPart(type, content) {
    const part = { type, content }
    this._parts.push(part)
    this.output$.trigger(this._parts)
  }
}

export default new Cli()
