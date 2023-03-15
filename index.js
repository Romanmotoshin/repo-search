const input = document.querySelector('.input-search')
const form = document.querySelector(".form")
const links = document.querySelector(".links")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const searchStr = input.value

    if(searchStr !== "") {
        links.innerHTML = ""

        fetch(`https://api.github.com/search/repositories?q=${searchStr}%20in:name&sort=stars&per_page=10`)
            .then(response => response.json())
            .then(data => addLinks(data))
    } else {
        showError()
    }
})

input.addEventListener("input", (e) => {
    if(e.target.value === '') {
        showError()
    } else {
        hideError()
    }
})


function showError() {
    const error = document.createElement('div')
    error.classList.add("error")
    error.innerHTML = "Введите один или более символ"
    document.querySelector(".search").appendChild(error)
}

function hideError() {
    if(document.querySelector(".error")) {
        document.querySelector(".error").remove()
    }
}

function addLinks(data) {

    if(data.total_count === 0) {
        links.innerHTML = "<h2>Ничего не найдено</h2>"
        return
    }
    data.items.forEach((item,i) => {
        const dataObj = transformData(item,i)

        const link = document.createElement('div')
        link.classList.add("item")
        link.innerHTML= `
        <a href="${dataObj.url}" target="_blank" class="title">${dataObj.num}.${dataObj.name}</a>
        <div class="descr">Описание:<br>${dataObj.descr}</div>
        `
        links.appendChild(link)
    })
}


function transformData(item, i) {
    let name = item.name
    let url = item.html_url
    let num = i + 1
    let descr = item.description

    if(name.length > 40) {
        name = name.slice(0, 40) + '...'
    }

    if(!descr) {
        descr = "Описание отсутствует"
    } else if(descr.length > 400){
        descr = descr.slice(0, 400) + '...'
    } 

    return {
        name,
        url,
        num,
        descr
    }
}

