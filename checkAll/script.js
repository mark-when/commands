const node = nodeFromStringIndex(context.editor.selections.main.from)

if (!node || !isEventNode(node)) {
  return
}
const { from, to } = node.value.rangeInText

const eventString = context
  .text
  .substring(from, to)

const replaced = eventString.split('\n').map(s => {
  return s.replace(/^\s*- \[ ?\]/, "- [x]")
}).join('\n')

return {
  changes: [{
    insert: replaced,
    from, to
  }]
}