function show_time(wt) {
    wt = Math.round(wt)

    let hours = document.querySelector('.timer__hours')
    let minutes = document.querySelector('.timer__minutes')
    let seconds = document.querySelector('.timer__seconds')

    if (wt > 3600) {
        let active_hours = Math.floor(wt / 3600)
        let active_minutes = Math.floor((wt - active_hours * 3600) / 60)
        let active_seconds = wt - active_hours * 3600 - active_minutes * 60

        if (active_hours < 10) {
            hours.innerHTML = `0${active_hours}`
        } else {
            hours.innerHTML = active_hours
        }

        if (active_minutes < 10) {
            minutes.innerHTML = `0${active_minutes}`
        } else {
            minutes.innerHTML = active_minutes
        }

        if (active_seconds < 10) {
            seconds.innerHTML = `0${active_seconds}`
        } else {
            seconds.innerHTML = active_seconds
        }

    } else if (wt >= 60) {
        let active_minutes = Math.floor(wt / 60)
        let active_seconds = wt - active_minutes * 60

        hours.innerHTML = `00`

        if (active_minutes < 10) {
            minutes.innerHTML = `0${active_minutes}`
        } else {
            minutes.innerHTML = active_minutes
        }

        if (active_seconds < 10) {
            seconds.innerHTML = `0${active_seconds}`
        } else {
            seconds.innerHTML = active_seconds
        }

    } else {
        hours.innerHTML = `00`
        minutes.innerHTML = `00`

        if (wt < 10) {
            seconds.innerHTML = `0${wt}`
        } else {
            seconds.innerHTML = wt
        }
    }
}

let timer = 0 // следит за временем
let active_date = Date.now() // время когда пользователь зашел на сайт

chrome.storage.local.get('time', result => { // время которое пользователь провел на сайте, открыв расширение
    timer = result.time
})

chrome.storage.local.get('date', data => {
    
    let active = Math.floor((new Date(active_date) - new Date(data.date)) / 1000)

    timer += active
})

chrome.storage.local.set({"date": 0})

setInterval(() => {

    document.querySelector('.clear').addEventListener('click', () => { // при клике очищать таймер
        chrome.storage.local.set({ "time": 0 })
        timer = 0
    })

    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, tabs => {
          let url = tabs[0].url

          if (url.search('ege.sdamgia.ru/') > -1) { // проверяем, является ли сайт РЕШУ ЕГЭ
            
            if (timer !== undefined) { // проверяем наличие переменной timer на локальной машине пользователя
                current_date = Date.now()
                timer++

                chrome.storage.local.set({ "time": timer }) // обозначаем необходимые переменные
                chrome.storage.local.set({ "date": current_date }) // активное время

                show_time(timer) // выводим время в расширении

            } else {
                chrome.storage.local.set({ "time": 0 })
            }
          }
      }); 
}, 1000)