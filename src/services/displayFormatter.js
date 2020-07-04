const specialBlockRx = /(\[[^\]]+\])/g

class displayFormatter {
  formatAsHtml(text) {
    const htmlParts = []

    const textParts = text.split(specialBlockRx)

    for (const part of textParts) {
      if (part.startsWith('[')) {
        htmlParts.push(makeSpecialHtml(part))
        continue
      }
      htmlParts.push(part ? `<span>${part}</span>` : null)
    }

    return htmlParts.filter((p) => !!p).join('')
  }
}

function makeSpecialHtml(rawText) {
  const text = rawText.slice(1, rawText.length - 1)
  const type = text.slice(0, 3)
  const content = text.slice(4)
  return `<span class="example-${type}">${content}</span>`
}

export default new displayFormatter()
