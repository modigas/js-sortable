// const body = document.body
const mainBody = document.body
const body = document.createElement('div')
body.classList.add('content')
mainBody.appendChild(body)
const showElements = ['10', '20', '50', '100', 'all results']
// const orderBy = ['name ascending', 'name desc', 'full name asc', 'full name dsc', 
//                  'powerstats asc', 'powerstats dsc', 'gender asc', 'gender dsc',
//                  'height asc', 'height dsc', 'weight asc', 'weight dsc', 
//                  'place of birth asc', 'place of birth dsc', 
//                  'alignment asc', 'alignment dsc']
const orderBy = ['name ↑', 'name ↓', 'full name ↑', 'full name ↓', 
                 'powerstats ↑', 'powerstats ↓', 'gender ↑', 'gender ↓',
                 'height ↑', 'height ↓', 'weight ↑', 'weight ↓', 
                 'place of birth ↑', 'place of birth ↓', 
                 'alignment ↑', 'alignment ↓']

const mainHeaders = {
    'Icon': ['images', 'xs'],
    'Name': ['name'],
    'Full Name': ['biography', 'fullName'],
    'Powerstats': ['powerstats'],
    'Race': ['appearance', 'race'],
    'Gender': ['appearance', 'gender'],
    'Height': ['appearance', 'height'],
    'Weight': ['appearance', 'weight'],
    'Place Of Birth': ['biography', 'placeOfBirth'],
    'Alignment': ['biography', 'alignment'],
}
const headers = Object.entries(mainHeaders).map(e => e[0])
const paths = Object.entries(mainHeaders).map(e => e[1])
const classNames = headers.map(e => e.split(' ').join('').toLowerCase())
var allData = {}

// Adds content of the json to the row defined by mainHeaders
const parseRowData = (data, paths) => {
    if (data !== undefined) {
        return paths.map(e => {
            return e.reduce((a,c,i) => {
                return i === 0 ? data[c] : a[c]
            }, 0)
        })
    }
    
}
// Creates list for the data passed as object 
const createList = (obj) => {
    const list = document.createElement('ul')
    if (obj !== null && obj !== undefined) {
        Object.entries(obj).forEach(e => {
            const entry = document.createElement('li')
            entry.innerHTML = `<i style="color : yellow;">${e[0]}</i> - ${e[1]}`
            list.appendChild(entry)
        })
    }
    return list
}
// Creates table for the data passed as the parameters
const createTable = (columns, parentNode, headers = false) => {
    if (headers) {
        const div = document.createElement('div')
        const table = document.createElement('table'),
              row = document.createElement('tr')
        div.classList.add('table')
        row.classList.add('headers')
        table.id = 'heroes'
        var count = 0
        columns.forEach(cat => {
            var h = document.createElement('th')
            h.classList.add(classNames[count++])
            h.textContent = cat
            row.appendChild(h)
        })
        table.appendChild(row)
        div.appendChild(table)
        parentNode.appendChild(div)
    } else {
        const newRow = document.createElement('tr')
        // const div = document.createElement('div')
        newRow.classList.add('stats')
        var count = 0
        if (columns !== undefined) {
            parseRowData(columns, paths).forEach(cat => {
                var h = document.createElement('td')
                h.classList.add(classNames[count++])
                if (typeof cat === 'string') {
                    if (cat.includes('.jpg')) {
                        const img = document.createElement('img')
                        img.src = cat
                        h.appendChild(img)
                    } else {
                        h.textContent = cat
                    }
                } else {
                    if (!Array.isArray(cat)) {
                        const list = createList(cat)
                        h.appendChild(list)
                    } else {
                        h.textContent = cat
                    }
                }
                newRow.appendChild(h)
            })
            parentNode.appendChild(newRow)
        }
    }
}
// Creates selection element on the page
const selectElement = () => {
    const div = document.createElement('div'),
          select = document.createElement('select'),
          label = document.createElement('label')
    div.classList.add('select')
    select.id = 'showEntries'
    label.for = 'showEntries'
    label.textContent = 'Show elements:'
    showElements.forEach(e => {
        const option = document.createElement('option')
        if (e === '20') {
            option.selected = 'selected'
        }
        option.value = e
        option.textContent = e
        select.appendChild(option)
    })
    div.appendChild(label)
    div.appendChild(select)
    body.appendChild(div)
}

const sortBySelect = () => {
    const div = document.createElement('div'),
          select = document.createElement('select'),
          label = document.createElement('label')
    div.classList.add('order')
    select.id = 'orderby'
    label.for = 'orderby'
    label.textContent = 'Sort By:'
    var count = 0
    orderBy.forEach(e => {
        const option = document.createElement('option')
        option.value = count++
        // option.value = e
        option.textContent = e
        select.appendChild(option)
    })
    div.appendChild(label)
    div.appendChild(select)
    body.appendChild(div)
}

// Creates input search bar on the page
const searchBar = () => {
    const div = document.createElement('div')
    const inputSearch = document.createElement('input')
    div.classList.add('search')
    inputSearch.setAttribute('onkeyup', 'searchFunction()')
    inputSearch.setAttribute('placeholder', 'Search for names')
    inputSearch.type = 'text'
    inputSearch.id = 'search'
    div.appendChild(inputSearch)
    body.appendChild(div)
}

// Function that dynamicaly searches for specified name
// const searchFunction = () => {
//     const input = document.getElementById('search')
//     const rows = document.querySelectorAll('.stats')
//     rows.forEach(e => {
//         var row = e.querySelector('.name')
//         if (row.textContent.toLowerCase().includes(input.value.toLowerCase())) {
//             e.style.display = ''
//         } else {
//             e.style.display = 'none'
//         }
//     })
// }

const searchFunction = () => {
    const input = document.getElementById('search')
    const rows = document.querySelectorAll('.stats')
    const filtered = allData.map(e => {
        if (e.name.toLowerCase().includes(input.value.toLowerCase())){
            return e
        }
    }).filter(h => h !== undefined)
    displayHeroes2(filtered, 0, filtered.length, true)
}

// Display table with the specified number of entries
const displayHeroes = (allHeroes, n = 20, change = false) => {
    var l = allHeroes.length
    if (typeof n === 'string') {
        if (n === 'all results') {
            n = l
        } else {
            n = Number.parseInt(n)
        }
    }
    if (!change) {
        createTable(headers, body, true)
    } else {
        // const table = document.getElementById('heroes')
        const table = document.getElementsByClassName('table')[0]

        table.remove()
        createTable(headers, body, true)
    }
    const table = document.querySelector('table')

    for (var i = 0; i < n; i++) {
        createTable(allHeroes[i], table)
    }
}

const displayHeroes2 = (allHeroes, start = 0, end = 20, change = false) => {
    var l = allHeroes.length
    if (typeof n === 'string') {
        if (n === 'all results') {
            n = l
        } else {
            n = Number.parseInt(n)
        }
    }
    if (!change) {
        createTable(headers, body, true)
    } else {
        // const table = document.getElementById('heroes')
        const table = document.getElementsByClassName('table')[0]

        table.remove()
        createTable(headers, body, true)
    }
    const table = document.querySelector('table')

    for (var i = start; i < end; i++) {
        createTable(allHeroes[i], table)
    }
}

const wrapElements = (className, ...elements) => {
    const div = document.createElement('div')
    div.classList.add(className)
    elements.forEach(e => {
        div.appendChild(e)
    })
    body.appendChild(div)
}

const pageSelection = (numElems = 20) => {
    const pageElems = document.createElement('ul'),
          prevPage = document.createElement('li'),
          nextPage = document.createElement('li'),
          currPage = document.createElement('li')

    pageElems.classList.add('pages')
    body.appendChild(pageElems)
    prevPage.classList.add('previous')
    nextPage.classList.add('next')
    currPage.classList.add('current')

    prevPage.classList.add('change-page')
    nextPage.classList.add('change-page')
    currPage.classList.add('change-page')

    prevPage.textContent = '<<  '
    nextPage.textContent = '  >>'
    currPage.textContent = 1
    pageElems.appendChild(prevPage)
    pageElems.appendChild(currPage)
    pageElems.appendChild(nextPage)
    body.appendChild(pageElems)
}

searchBar()
selectElement()
sortBySelect()
pageSelection()
wrapElements('func', document.querySelector('.search'), 
                     document.querySelector('.select'),
                     document.querySelector('.order'))
wrapElements('pagesfunc', document.querySelector('.pages'))

const initClickers = (classes) => {
    const obj = {}
    classes.forEach(e =>{
        obj[e] = 0
    })
    return obj
}

const sortColumn = (operation) => {
    // console.log(operation)
    allData.sort((a,b) => {
        var el1, el2
        if (operation == 0 || operation == 1) {
            el1 = a.name
            el2 = b.name
        } else if (operation == 2 || operation == 3) {
            el1 = a.biography.fullName
            el2 = b.biography.fullName
        }
        // if (operation == 0 || operation == 1) {
        //     return operation%2 === 1 ? a.name < b.name : a.name > b.name
        // } else if (operation == 2 || operation == 3) {
        //     return operation%2 === 1 ? a.biography.fullName < b.biography.fullName : a.biography.fullName > b.biography.fullName
        // }
        return operation%2 === 1 ? el1 < el2 : el1 > el2
    })
}

// Load data to JSON
const loadData = heroes => {
    allData = heroes
    var count = 1
    const len = allData.length,
          next = document.querySelector('.next'),
          prev = document.querySelector('.previous'),
          curr = document.querySelector('.current'),
          se = document.querySelector('#showEntries'),
          so = document.querySelector('#orderby')
    // console.log(so.value)
    displayHeroes(heroes)
    se.addEventListener('input', (e) => {
        displayHeroes(allData, se.value, true)
        // const nameCategory = document.querySelector('th.name')
    })
    so.addEventListener('input', (e) => {
        sortColumn(so.value)
        displayHeroes(allData, se.value, true)
        curr.textContent = 1
        count = 1
    })
    
    next.addEventListener('click', (e) => {
        if (count < Math.ceil(len/se.value)) {
            count++
            curr.textContent = count
            displayHeroes2(allData, (count-1)*se.value, count*se.value-1, true)
        }
    })
    prev.addEventListener('click', (e) => {
        if (count > 1) {
            count--
            curr.textContent = count
            displayHeroes2(allData, (count-1)*se.value, count*se.value-1, true)
        }
    })
}

// searchBar()
// selectElement()

// const s = document.querySelector('select')

// s.addEventListener('input', (e) => {
//     displayHeroes(allData, s.value, true)
//     // const nameCategory = document.querySelector('th.name')
// })

// Request the file fetch, it will download it in your browser cache
fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
    .then((response) => response.json()) // parse the response from JSON
    .then(loadData) // .then will call the function with the JSON value
