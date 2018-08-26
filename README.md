# tradelist

## How to
* Download this repository as .zip and extract
* Install NodeJS (https://nodejs.org/en/download/)
* Open a Command Prompt / Terminal / Shell and navigate to the project
* Run `node shop.js`

The consolidated inventory dump under `io/inventory.txt` will be tekked, sorted, categorised, colored and exported to `io/tradelist.txt`. These paths and filenames are configurable under `options.json`

## Example
### Before
`[U] Gladius +4 [Spirit] [0/0/0/40|40]`
### After
`Gladius +4 [COLOR=#F7BB13][Spirit][/COLOR] [0/0/0/50|[COLOR=#7f7f00]50[/COLOR]]`

## Options
### `includeIntro`
Prepend your tradelist with an introduction for rates and contact details etc. By default this is read from `io/shop_intro.txt`

### `logTekker`
Output a "before and after" for each item which requires tekking

### `logReserve`
Output each reserved item as it is excluded from the list

## Advanced
### Special colors
These can be modified under `data/special.json` these are currently set to the same defaults as item reader.

### Inclusion / Exclusion lists
`data/item.json` contains patterns for normals (eg. Saber) so that they may be excluded from the rares list. It also contains inclusion lists for items which do not follow a pattern (eg. V101 does not follow the standard unit pattern `*/*`).

### Item patterns
Custom patterns can be set in `data/pattern.json`

### Modify sections
You may modify the order in which sections are represented, add and remove sections, or change their titles. This can be found under `const sections` near the very beginning of `shop.js`. Custom formatting functions and exclusions or inclusions can also be set here.
