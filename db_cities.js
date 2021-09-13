const col = document.querySelectorAll('.dropdown-lists__col');
const input = document.querySelector('#select-cities');
const defaultList = document.querySelector('.dropdown-lists__list--default');
const selectList = document.querySelector('.dropdown-lists__list--select');
const autocompleteList = document.querySelector('.dropdown-lists__list--autocomplete');
const dropDown = document.querySelector('.dropdown');
const body = document.getElementsByTagName('body')[0];
const cities = document.querySelectorAll('.dropdown-lists__line');
const button = document.querySelector('.button');
const closeBtn = document.querySelector('.close-button');
const label = document.querySelector('.label');

//Запрос языка
window.addEventListener('DOMContentLoaded', () => {
    if (document.cookie.match('language=RU') || document.cookie.match('language=DE') || document.cookie.match('language=EN')) {
        return;
    } else {
        let lang = prompt('Select a language');
        document.cookie = `language=${lang}`;
    }
});

//получение данных с сервера и запись их на localStorage
const getData = async () => {
    // путь к запросу
    const data = await fetch('./db_cities.json').then((response) => {
        if (response.status !== 200) {
            // вызов сообщения об ошибке
        throw new Error(`Данные небыли получены, ошибка ${data.status} ${data.statusText}`);
        }
        return (response.json());
    }).then((response) => {
        localStorage.data = JSON.stringify(response);
    });
};
getData();

button.classList += ' disabled';



//Вывод списка default
const printCountriesDefault = (outputData) => {

    defaultList.style.display = '';
    selectList.style.display = 'none';
    autocompleteList.style.display = 'none';
    const lang = document.cookie.replace(/[^A-Z]/g, '');
    outputData = JSON.parse(localStorage.data)[lang];

    
    //сортировка стран по языку
    let langData = outputData.sort((a, b) => {
        if (a.country === lang) return -1;
        if (b.country == lang) return 1;
        return a.country.localeCompare(b.country);
    });

    if (lang === 'EN' || lang ==='RU') {
        langData = langData.reverse();
    }
    col[0].innerHTML = '';
    //для каждого элемента создаётся countryBlock
    langData.forEach(element => {
        let countryBlock = document.createElement('div');
        countryBlock.classList = 'dropdown-lists__countryBlock';
        countryBlock.innerHTML = `
        <div class="dropdown-lists__total-line">
        <div class="dropdown-lists__country">${element.country}</div>
        <div class="dropdown-lists__count">${element.count}</div>
        </div>
        `;
        //сортировка городов по численности населения
        let cities = element.cities.sort((a, b) => b.count - a.count);
        let a = 0;
        
        //для каждого города создаём newCity
        cities.forEach(item => {
            if (a < 3) {
                let newCity = document.createElement('div');
                newCity.classList = 'dropdown-lists__line';
                newCity.dataset.href = item.link;
                newCity.innerHTML = `
                <div class="dropdown-lists__city">${item.name}</div>
                <div class="dropdown-lists__count">${item.count}</div>`;
                countryBlock.insertAdjacentElement('beforeend', newCity);
                a++;
            }
        });
        
        col[0].insertAdjacentElement('beforeend', countryBlock);
  
    });
};

//вывод списка Select
const printCountriesSelect = (outputData, target) => {
    
    
    defaultList.style.display = 'none';
    selectList.style.display = 'inline';
    autocompleteList.style.display = 'none';
    
    const lang = document.cookie.replace(/[^A-Z]/g, '');
    outputData = JSON.parse(localStorage.data)[lang];
    //сортировка стран по языку
    let langData = outputData;
            //создание полного списка городов одной страны
            langData.forEach(element => {
                if (target.childNodes[1] && element.country !== target.childNodes[1].textContent) {
                    return;
                }
                else if ((target.childNodes[1] &&
                        element.country === target.childNodes[1].textContent &&
                        +element.count === +target.childNodes[3].textContent) || 
                        (element.country === target.textContent || +element.count === +target.textContent)) {
                    
                    col[1].innerHTML = '';
                    let countryBlock = document.createElement('div');
                    countryBlock.classList = 'dropdown-lists__countryBlock';
                    countryBlock.innerHTML = `
                    <div class="dropdown-lists__total-line">
                    <div class="dropdown-lists__country">${element.country}</div>
                    <div class="dropdown-lists__count">${element.count}</div>
                    </div>
                    `;

                    let cities = element.cities.sort((a, b) => b.count - a.count);
                    cities.forEach(item => {
                        let newCity = document.createElement('div');
                        newCity.classList = 'dropdown-lists__line';
                        newCity.dataset.href = item.link;
                        newCity.innerHTML = `
                        <div class="dropdown-lists__city">${item.name}</div>
                        <div class="dropdown-lists__count">${item.count}</div>`;
                        countryBlock.insertAdjacentElement('beforeend', newCity);
                    });
                    
                    col[1].insertAdjacentElement('beforeend', countryBlock);
                }
                 
                
                
            });
};

//вывод списка Autocomplete
const printCitiesAutocomplete = (outputData) => {

    defaultList.style.display = 'none';
    selectList.style.display = 'none';
    autocompleteList.style.display = 'inline';

    const lang = document.cookie.replace(/[^A-Z]/g, '');
    outputData = JSON.parse(localStorage.data)[lang];
    let langData = outputData;
    //создание одного countryBlock
    let countryBlock = document.createElement('div');
    countryBlock.classList = 'dropdown-lists__countryBlock';
    langData.forEach(element => {
        let cities = element.cities.sort((a, b) => b.count - a.count);
        //вывод всех городов всех стран
        cities.forEach(item => {
            let newCity = document.createElement('div');
                newCity.classList = 'dropdown-lists__line';
                newCity.dataset.href = item.link;
                newCity.style.display = 'none';
                newCity.innerHTML = `
                <div class="dropdown-lists__city">${item.name}</div>
                <div class="dropdown-lists__count">${element.country}</div>`;
                countryBlock.insertAdjacentElement('beforeend', newCity);
         });
                
    });
    col[2].insertAdjacentElement('beforeend', countryBlock);
};

//пауза-имитация загрузки с сервера
const pause = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 800);
    });
};

const removeList = (element) => {
    let position1 = 10;
    const interval = setInterval(() => {
        if (position1 < 415) {
            element.style.cssText = `
                position: relative;
                left: ${position1}px;
                overflow: hidden;`;
            position1 += 5;
        } else {
            clearInterval(interval);
            element.style.display = 'none';
        }   
    });
};

const addList = (element) => {
    let position1 = -425;
    const interval = setInterval(() => {
        if (position1 < 0) {
            element.style.cssText = `
                display: inline;
                position: relative;
                left: ${position1}px;
                overflow: hidden;`;
            position1 += 5;
        } else {
            clearInterval(interval);
        }   
    });
};

//слушатель
body.addEventListener('click', (event) => {
    
    let target = event.target;
    label.textContent = 'Страна или город';
    //если кликнули на input
    if (target === input) {
        if (target.value === '') {
            defaultList.style.display = 'inline';
            input.placeholder = '';
            if (col[0].innerHTML === '') {
                
                printCountriesDefault(localStorage.data);
            } else {
                addList(defaultList);
            }
        } else if (target.value) {
            printCitiesAutocomplete(localStorage.data);
            
        }
    }
    //если кликнули на страну в списке default
    else if (col[0].contains(target) &&
              (target.classList.contains('dropdown-lists__total-line') || target.parentNode.classList.contains('dropdown-lists__total-line'))) {
        printCountriesSelect(localStorage.data, target);
        removeList(defaultList);
        addList(selectList);
    
    }
    //если кликнули на страну в списке Select
    else if (col[1].contains(target) && (target.classList.contains('dropdown-lists__total-line') || target.parentNode.classList.contains('dropdown-lists__total-line'))) {
        printCountriesDefault(localStorage.data, target);
        removeList(selectList);
        addList(defaultList);

    }
    //если кликнули на город в любом списке
    else if ((col[1].contains(target) || col[0].contains(target) || col[2].contains(target)) && (target.classList.contains('dropdown-lists__line') || target.parentNode.classList.contains('dropdown-lists__line'))) {

        autocompleteList.style.display = 'none';
        defaultList.style.display = 'none';
        selectList.style.display = 'none';
        closeBtn.style.display = 'inline';
        label.textContent = '';
        button.classList = 'button';
        //присуждение ссылки города кнопке button в зависимости от того, на что кликнули
        if (target.dataset.href) {
            input.placeholder = target.childNodes[1].textContent;
            input.value = target.childNodes[1].textContent;
            button.href = target.dataset.href;
        } else {
            if (target.classList.contains('dropdown-lists__city')) {
                input.placeholder = target.textContent;
                input.value = target.textContent;
            }
            else {
                input.placeholder = target.previousSibling.previousSibling.textContent;
                input.value = target.previousSibling.previousSibling.textContent;
            }
            button.href = target.parentNode.dataset.href;
        }
    }
    //если кликнули на кнопку закрытия
    else if (target === closeBtn) {
        printCountriesDefault(localStorage.data);
        label.textContent = 'Страна или город';
        input.placeholder = '';
        input.value = '';
        button.classList += ' disabled';
        closeBtn.style.display = 'none';
        addList(defaultList);
    }
    //если кликнули в пустое поле
    else {
        if (input.value !== ''){
            label.innerHTML = '';
            }
        
        autocompleteList.style.display = 'none';
        defaultList.style.display = 'none';
        selectList.style.display = 'none';
    }
});
input.addEventListener('focus', () => {
        input.value = '';
})

//событие ввода букв в input
input.addEventListener('input', () => {
    if (input.value === '') {
        
        autocompleteList.style.display = 'none';
        defaultList.style.display = 'inline';
        
        printCountriesDefault(localStorage.data);
        //если инпут не пустой
    } else {
        //создание анимации загрузки
        const loadMessage = `<div><div class="sk-spinner sk-spinner-pulse"></div></div>`;
        button.classList = 'button';
        autocompleteList.style.display = 'inline';
        defaultList.style.display = 'none';
        col[2].innerHTML = loadMessage;

        (async () => {
            //вывод списка городов и имитация задержки
            printCitiesAutocomplete(localStorage.data);
            await pause();

            autocompleteList.style.display = 'inline';
            selectList.style.display = 'none';
            defaultList.style.display = 'none';
            let str = new RegExp(input.value, 'i');
            
            let autocompleteCities = autocompleteList.children[0].children[1].querySelectorAll('.dropdown-lists__line');
            //удаление анимации загрузки
            autocompleteList.children[0].children[0].remove();
            //если какие-либо из городов подходят под то, что написано в input
            if ([...autocompleteCities].some(elem => ((elem.childNodes[1].textContent.match(str) !== null) && (elem.childNodes[1].textContent.match(str)).index === 0))) {
                autocompleteCities.forEach(elem => {
                    //выделение совпадающих букв жирным шрифтом
                    if ((elem.childNodes[1].textContent.match(str) !== null) && (elem.childNodes[1].textContent.match(str)).index === 0) {
                        elem.style.display = '';
                        let string = elem.childNodes[1].innerHTML.replace(str, (a) => { return (a = `<b>${a}</b>`); });
                        elem.childNodes[1].innerHTML = string;
                    }
                    else {
                        elem.style.display = 'none';
                    }
                });
                //если значение инпута не совпадает с городами
            } else {
                col[2].innerHTML = 'Ничего не найдено';
            }
        })();
    }
});
