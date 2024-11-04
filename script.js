document.addEventListener('DOMContentLoaded', () => {
    changeCardActive()
    setHijriDate()
    setQamariDate()
    // Sets time zone, If region available in LS takes it or sets Tashkent as time zone
    if (localStorage.getItem('region') === null) {
        getPrayerTimes('Toshkent')
    } else {
        let getRegionFromLS = window.localStorage.getItem('region')
        getPrayerTimes(getRegionFromLS)
    }
    // Writes Current Hour, minute and second to the DOM
    currentTimes()
})

// regions

// dropdown
const regions = [
    "Andijon",
    "Buxoro",
    "Denov",
    "Farg'ona",
    "Guliston",
    "Jizzax",
    "Namangan",
    "Nukus",
    "Navoiy",
    "Qarshi",
    "Samarqand",
    "Toshkent",
    "Xiva"
]
const dropdown = document.querySelector('.dropdown')
const dropList = document.querySelector('.areas')
const chevron = document.querySelector('.chevron svg')
const currentArea = document.querySelector('.current-place')

dropdown.onclick = () => {
    dropList.classList.toggle('active')
    chevron.classList.toggle('active')
}
// Creates list item based on regions array and appends to DOM
regions.forEach(region => {
    const item = document.createElement('div')
    item.classList.add('area-item')
    item.innerText = region
    dropList.appendChild(item)
})

// List Item element of region array
const dropItems = document.querySelectorAll('.area-item')

// Sets current time zone, calls for getPrayerTimes() and set it to LocalStorage
dropItems.forEach(item => {
    item.onclick = (e) => {
        const itemText = e.target
        dropdown.classList.remove('active')
        chevron.classList.remove('active')
        currentArea.innerText = itemText.innerText
        getPrayerTimes(itemText.innerText)
        window.localStorage.setItem('region', currentArea.innerText)
    }
})

// Displays current day, year based on Hijri calendar
function setHijriDate() {
    const hijriTime = document.querySelector('.hijri-time')
    const date = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric',
        year: 'numeric',
        month: 'long',
    }).format(Date.now())
    hijriTime.innerHTML = date
}

// Displays current day, month based on Gregorian calendar
function setQamariDate() {
    const qamariTime = document.querySelector('.qamariy-time')

    const arrayOfWeekdays = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]
    const arrayOfMonths = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"]

    // getting date with week day name
    const date = new Date()
    const weekdayNumber = date.getDay()
    const weekdayName = arrayOfWeekdays[weekdayNumber]

    // getiing date
    const day = date.getDate()
    // getting month with it's name
    const monthNumber = date.getMonth()
    const monthName = arrayOfMonths[monthNumber]

    const currentDate = `${weekdayName}, ${day} - ${monthName}`;
    qamariTime.innerHTML = currentDate
}

// Displays current Time
function currentTimes() {
    const date = new Date();
    const currentTime = document.querySelector('.current-time')

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const currentDate = `${formatTime(hour)}:${formatTime(minute)}:${formatTime(second)}`;
    currentTime.innerHTML = currentDate
}

// Displays time with 0 when hour, minute or second is below 10
function formatTime(time) {
    return time < 10 ? `0${time}` : time
}

setInterval(() => {
    currentTimes()
}, 60000)

setInterval(() => {
    changeCardActive()
    setHijriDate()
    setQamariDate()
}, 60000)

const baseUrl = 'https://islomapi.uz/api/present/'

async function getPrayerTimes(region) {
    const resp = await fetch(`${baseUrl}day?region=${region}`);
    const result = await resp.json();
    displayPrayerTimes(result);
    window.localStorage.setItem('region', region);

    // Send prayer times to background script
    const prayerTimes = Object.values(result.times).slice(0, 6); // Adjust if prayer times have more items
    chrome.runtime.sendMessage({ type: "setPrayerAlarms", prayerTimes });
}


const prayerTimes = document.querySelectorAll('.prayer-time')

// Displays 5 prayer times
function displayPrayerTimes(region) {
    prayerTimes.forEach((item, index) => {
        item.innerHTML = Object.values(region.times)[index]
    })

    currentArea.innerText = region.region
    changeCardActive()

}

const cards = document.querySelectorAll('.prayer-box')
const date = new Date()
const currentHour = date.getHours()
const currentMin = date.getMinutes()
const currentTime = formatTime(currentHour) + ':' + formatTime(currentMin)

// changes Active card's bg when one of 5 prayer time is active
function changeCardActive() {
    let currentTimeToString = currentTime.split(':').join("")

    const timeArr = []
    prayerTimes.forEach(item => {
        timeArr.push(item.innerText.split(':').join(''))
    })
    let currentNumber = timeArr.reverse().find((e) => e <= currentTimeToString)
    timeArr.sort((a, b) => {
        return a - b
    })
    let activeCardIndex = timeArr.indexOf(currentNumber)
    cards.forEach(card => {
        card.classList.remove('active')
    })
    console.log(currentTimeToString)
    if ((currentTimeToString >= '0000') && (currentTimeToString < timeArr[0])) {
        cards.forEach(card => {
            card.classList.remove('active')
        })
        cards[5].classList.add('active')
    } else {
        cards[activeCardIndex].classList.add('active')

    }
}


