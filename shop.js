const fs = require('fs')
const item = require('./data/item.json')
const special = require('./data/special.json')
const pattern = require('./data/pattern.json')
const option = require('./options.json')

const sections = [
   { title: 'Rare', pattern: pattern.rare, exclude: item.normal, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Charge', pattern: pattern.charge, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Berserk', pattern: pattern.berserk, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Geist', pattern: pattern.geist, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Hell', pattern: pattern.hell, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Demon\'s', pattern: pattern.demon, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Gush', pattern: pattern.gush, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Arrest', pattern: pattern.arrest, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Other', pattern: pattern.special, format: [tekkItem, percentColor, typeColor] }
  ,{ title: 'Armor', pattern: pattern.armor, format: [slotColor] }
  ,{ title: 'Shield', pattern: pattern.shield }
  ,{ title: 'Mag', pattern: pattern.mag }
  ,{ title: 'Unit', pattern: pattern.unit, include: item.unit }
  ,{ title: 'Tech', pattern: pattern.tech}
  ,{ title: 'Amp', pattern: pattern.amp }
]

function percentColor(str) {
  const match = str.match(/\|\d+/)
  if (!match) return str

  const amount = parseInt(match[0].substring(1))
  let r = (Math.floor((255/100)*(amount))).toString(16)
  let g = (Math.floor((255/100)*(100-amount))).toString(16)
  if (r.length === 1) r = "0" + r
  if (g.length === 1) g = "0" + g

  const col = '|[COLOR=#' + r + g + '00]' + amount + '[/COLOR]'

  return str.replace(/\|\d+/, col)
}

function typeColor(str) {
  for (let i in special) {
    let out = str.replace('[' + i + ']', '[COLOR=' + special[i] + '][' + i + '][/COLOR]')
    if (out !== str) {
      return out
    }
  }
  return str
}

function slotColor(str) {
  //TODO: Color slot amount like item reader
  return str
}

function writeSection(section) {
  if (!section.list || section.list.length < 1) return

  let str =  '[u]' + section.title + '[/u]\r\n'

  for (let i in section.list)
    str += section.list[i] + '\r\n'

  return str + '\r\n\r\n'
}

function reservedItem(item) {
  for (let j in option.reserved) {
    if ((item.indexOf(option.reserved[j].name) > -1) && option.reserved[j].amount > 0) {
      if (option.logReserved) {
        console.log('=== Reserved: ' + option.reserved[j].name + ' ===')
      }

      option.reserved[j].amount -= 1
      return true
    }
  }
  return false
}

function excludedItem(section, item) {
  const tekked = tekkItem(item)
  if (section.exclude && section.exclude.length) {
    for (let i in section.exclude) {
      if (tekked.match(section.exclude[i])) {
        return true
      }
    }
  }
  return false
}

function includedItem(section, item) {
  let included = Boolean(item.match(section.pattern))

  if (section.include && section.include.length) {
    included = included || section.include.indexOf(item) > -1
  }

  return included
}

function addTen(num) {
  const perc = parseInt(num)
  return perc > 0 ? perc + 10 : perc
}

function addPerc(str, native, abeast, machine, dark, hit) {
  return '[' + addTen(native) + '/' + addTen(abeast) + '/' +
    addTen(machine) + '/' + addTen(dark) + '|' + addTen(hit) + ']'
}

function tekkItem(item) {
  if (item.indexOf('[U]') !== 0) return item
  let oldItem = item
  let newItem = item.replace(/\[(\d+)\/(\d+)\/(\d+)\/(\d+)\|(\d+)\]/, addPerc)
  newItem = newItem.replace(/\[U\] /g, '')

  if (option.logTekker) {
    console.log('=== Untekked:', oldItem, 'as', newItem, '===')
  }

  return newItem
}

function sortItem(item) {
  if (reservedItem(item)) return
  for (let i in sections) {
    if (!sections[i].list) sections[i].list = []
    if (excludedItem(sections[i], item)) continue
    if (!includedItem(sections[i], item)) continue

    let formattedItem = item
    if (sections[i].format && sections[i].format.length) {
      for (let f in sections[i].format) {
        formattedItem = sections[i].format[f](formattedItem)
      }
    }

    return sections[i].list.push(formattedItem)
  }
}

function sortLists() {
  for (let i in sections) {
    if (sections[i].list && sections[i].list.length) {
      sections[i].list = sections[i].list.sort((a, b) => a > b)
    }
  }
}

function sortItems(items) {
  for (let i in items) {
    sortItem(items[i])
  }
}

function readFile(readFrom) {
  const file = fs.readFileSync(readFrom)
  if (!file) console.log(readFrom, 'not found')
  const items = file.toString().replace(/\r/g, '').split(" \n")

  sortItems(items)
  sortLists()
}

function writeFile(introFrom, writeTo) {
  let out = fs.readFileSync(introFrom)
  for (let i in sections) {
    out += writeSection(sections[i])
  }

  fs.writeFile(writeTo, out, function(err) {
    if (err) return console.log(err);
    console.log(writeTo, 'saved');
  })
}

readFile(option.readFrom)
writeFile(option.introFrom, option.writeTo)
