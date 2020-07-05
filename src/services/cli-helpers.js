export function createOption(command, shorthand, description) {
  return {
    Command: command,
    Shorthand: shorthand,
    Description: description,
  }
}
