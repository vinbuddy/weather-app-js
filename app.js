const container = document.querySelector('.container')
const inputPart = document.querySelector('.input-part')
const inputState = document.querySelector('.input-part__state')
const inputField = document.querySelector('.input-part__input')
const back = document.querySelector('.container header i')
const locateBtn = document.querySelector('.input-part__btn')
const weatherImg = document.querySelector('.weather-part__img')
const background = document.querySelector('body')

var apiKey = '74f1c7aaddf8982ecb516ad798e1fef5'
var api;

// back 
back.addEventListener('click', () => {
    container.classList.remove('active')
})

inputField.addEventListener('keyup', e => {
    if(inputField.value != '' &&  e.key == 'Enter') {
        cityApi(inputField.value)
    }
})

locateBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        // Nhận 2 call back: successCallback, errorCallback
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert('Trình duyệt không được hỗ trợ định vị')
    }
})

function success(position) {
    const {latitude, longitude} = position.coords
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    fetchData()
}

function error(error) {
    inputState.innerText = error.message
    inputState.classList.add('error')
}

function cityApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    fetchData()
}

function fetchData() {
    // Khi nhập đúng thì sẽ chuyển trạng thái 
    inputState.innerText = 'Getting city\'s weather...'
    inputState.classList.add('pending')

    fetch(api)
        .then((response) => response.json())
        .then((data) => {
            // Nhận về data và truyền vào hàm khác để render ra html
            weatherInfor(data)
        })

}

// render ra thông tin thời tiết
function weatherInfor(infor) {
    // invalid city
    if (infor.cod == '404') {
        inputState.innerText = `${inputField.value} isn't a valid city name`
        inputState.classList.replace('pending', 'error')
    } else {
        const city = infor.name
        const country = infor.sys.country
        const {description, id} = infor.weather[0] // Dựa vào id để đổi hình mây
        const {feels_like, humidity, temp} = infor.main
        
        console.log(id)
        // Đổi hình dựa vào id thời tiết
        if (id == 800) {
            weatherImg.src = './icons/clear.svg'
        } else if (id >= 200 && id <= 232) {
            weatherImg.src = './icons/storm.svg'
        } else if (id >= 600 && id <= 622) {
            weatherImg.src = './icons/snow.svg'
        } else if (id >= 701 && id <= 781) {
            weatherImg.src = './icons/haze.svg'
        } else if (id >= 801 && id <= 804) {
            weatherImg.src = './icons/cloud.svg'
        } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
            weatherImg.src = './icons/rain.svg'
        }   

        // render ra html
        document.querySelector('.weather-part__num').innerText = Math.floor(temp)
        document.querySelector('.weather-part__state').innerText = description
        document.querySelector('.weather-part__location span').innerText = `${city}, ${country}`
        document.querySelector('.weather-part__feel').innerText = Math.floor(feels_like) 
        document.querySelector('.weather-part__humidity').innerText = `${humidity} %`

        container.classList.add('active')
        inputState.classList.remove('pending', 'error')
        inputField.value = ''
    }
}