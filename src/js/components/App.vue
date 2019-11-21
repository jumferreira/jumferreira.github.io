<template>
    <div class="main">
        <div class="header">
            <div class="container">
                <div class="columns items-center">
                    <div class="column logo_column">
                        <h1 class="header__logo">
                            <a href="https://site.blueticket.com.br/">
                                <img class="header__image" src="https://images.assets-landingi.com/0Vj6dch8/logo-blueticket-color.png" alt="">
                            </a>
                        </h1>
                    </div>

                    <div class="column">
                        <div class="header__search">
                            <div class="header__search-holder">
                                <input
                                    type="text"
                                    class="input input--grey-darker input--full"
                                    placeholder="Busca por endereços"
                                    v-model="searchField"
                                    @keyup.enter="search()"
                                    @click="searchHistoryBar = true"
                                >
                                <i
                                    class="fas fa-search"
                                    @click="search()"
                                ></i>
                                <i
                                    v-if="searchHistoryBar"
                                    class="fas fa-times"
                                    @click="clearSearch()"
                                ></i>
                            </div>

                            <ul
                                v-if="searchHistory.length && searchHistoryBar"
                                class="header__search-results"
                            >
                                <li
                                    class="header__search-result"
                                    v-for="(item, index) in searchHistory"
                                    :key="index"
                                    v-text="item"
                                    @click="searchUserAddress(item)"
                                ></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="body">
            <div class="container">

                <div class="loader" v-if="isLoading"></div>

                <div class="columns" v-if="! isLoading">
                    <div class="column">
                        <h2
                            v-if="! isLoading"
                            class="weather_list__title"
                            v-text="'Check the weather next to you'"
                        ></h2>

                        <!-- <div class="empty-message" v-if="isShowingInitialMessage && isEmptyResult"> -->
                        <!-- <div class="empty-message">
                            <h3>Bem vindo ao painel de busca de endereços e tempo e temperatura <i class="fab fa-github"></i></h3>

                            <p>Para usar o buscador é muito simples!</p>
                            <br />

                            <p>Você pode autorizar o navegador a usar sua localização ou então digitar seu endereço e a previsão do tempo já vai aparecer bem aqui. Viu como é simples?</p>
                        </div> -->

                        <!--
                            TODO:
                            - SALVAR HISTÓRICO DE BUSCA EM UM ARRAY
                            - CRIAR BUSCA OTIMIZADA COM ESSE ARRAY
                            - CACHEAR ESSES DADOS

                        -->
                        <div class="content">
                            <div class="content__left">
                                <div class="location">
                                    <strong>Sua localização atual é:</strong>
                                    <p>Rua Raposo Tavares, 9-72 - Bauru - São Paulo</p>
                                    <br />
                                    <strong v-if="searchedAddress">Último resultado obtido:</strong>
                                    <p v-text="searchedAddress"></p>
                                </div>

                                <div
                                    v-if="searchHistory.length"
                                    class="location_history"
                                >
                                    Histórico de busca:

                                    <ul>
                                        <li
                                            v-for="(item, index) in searchHistory"
                                            :key="index"
                                            v-text="item"
                                        ></li>
                                    </ul>
                                    <!-- colocar histórico em cache -->
                                </div>
                            </div>

                            <div class="content__right">
                                <div class="weather">
                                    <p class="weather__title">As informações do clima no momento:</p>

                                    <div class="weather__box">
                                        <div class="weather__box-header">
                                            <p>{{ weatherData.city  + ' - ' + weatherData.country }}</p>
                                            <p v-text="getCurrentTime"></p>
                                            <p v-text="weatherData.weather[0].title"></p>
                                        </div>

                                        <div class="weather__box-body">
                                            <div class="weather__box-body_left">
                                                <img v-lazy="iconUrl(weatherData.weather[0].icon)" alt="weather">
                                                <p>
                                                    {{ aroundTemperature(weatherData.weather[0].temp) + '°C' }}
                                                </p>
                                            </div>

                                            <div class="weather__box-body_right">
                                                <p>Chuva: {{ weatherData.weather[0].rain }}%</p>
                                                <p>Umidade: {{ weatherData.weather[0].humidity }}%</p>
                                                <p>Vento: {{ windSpeedParsed(weatherData.weather[0].windSpeed) }}km/h</p>
                                            </div>
                                        </div>

                                        <div class="weather__box-next-days">
                                            <ul class="weather__items">
                                                <li
                                                    class="weather__item"
                                                    v-for="(weather, index) in weatherData.weather"
                                                    :key="index"
                                                >
                                                    <p>{{ getParsedDate(weather.dateTime) }}</p>
                                                    <img v-lazy="iconUrl(weather.icon)" alt="">
                                                    <p>{{ aroundTemperature(weather.temp) + '°C'}}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data: () => ({
        weatherData: {
            city: null,
            country: null,
            weather: [],
        },

        isLoading: false,
        searchHistoryBar: false,

        searchField: null,
        searchHistory: [],
        searchedAddress: null,
    }),

    computed: {
        getCurrentTime () {
            let today = new Date();

            return (today.getHours()-1) + ":" + today.getMinutes() + ":" + today.getSeconds();
        },

        getCurrentDate () {
            let today = new Date();
            return today.getDate() + "-" + (today.getMonth()+1)  + "-" + today.getFullYear();
        },
    },


    methods: {
        iconUrl (icon) {
            return `https://openweathermap.org/img/wn/${icon}@2x.png`;
        },

        windSpeedParsed (windValue) {
            return Math.round(windValue * 3.6);
        },

        getParsedDate (dateTime) {
            let date = dateTime.split(' ')[0];
            let finalDate = date.split('-');

            return finalDate[2] + '-' + finalDate[1];
        },

        getClosestHour () {
            let possibilities = ['00', '03', '06', '09', '12', '15', '18', '21'];

            let today = new Date();

            let currentHour = today.getHours()-1;

            if (currentHour >= 22 && currentHour <= 24 || currentHour === -1) {
                currentHour = '00';
            }

            console.log('getHours: ', currentHour);
            if (possibilities.includes(currentHour.toString())) {
                console.log('entrou 1');
                return currentHour + ':00:00';
            }

            if (possibilities.includes((currentHour + 1).toString())) {
                console.log('entrou 2');
                return (currentHour + 1) + ':00:00';
            }

            if (possibilities.includes((currentHour + 2).toString())) {
                console.log('entrou 3');
                return (currentHour + 2) + ':00:00';
            }
        },

        parseWeather (data) {
            this.clearWeather();

            this.weatherData.city = data.city.name;
            this.weatherData.country = data.city.country;

            let closestHour = this.getClosestHour();

            let filteredList = _.filter(data.list, item => {
                return item.dt_txt.includes(closestHour);
            });

            _.forEach(filteredList, item => {
                let weatherItem = {
                    clouds: item.clouds.all,
                    humidity: item.main.humidity,
                    temp: item.main.temp,
                    tempMax: item.main.temp_max,
                    tempMin: item.main.temp_min,
                    dateTime: item.dt_txt,
                    title: item.weather[0].main,
                    icon: item.weather[0].icon,
                    windSpeed: item.wind.speed,
                };

                this.weatherData.weather.push(weatherItem);
            });

        },

        async getWeather (latitude, longitude) {

            // certo
            // tempo
            // let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b077652524e83bc12498a0846b5f135d`);

            // vários dias
            let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=b077652524e83bc12498a0846b5f135d`);


            this.parseWeather(data);
            console.log('getWeather: ', data);
        },

        getUserLocation () {
            if (! _.isEmpty(navigator.geolocation)) {
                navigator.geolocation.getCurrentPosition(position => {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;

                    // TODO: ARRUMAR PRA QUANDO NÃO TEM LOCALIZAÇÃO
                    //
                    console.log('getUserLocation: ', position);

                    this.getWeather(latitude, longitude);
                });
            }
            console.log('getUserLocation ',  navigator.geolocation);
        },

        async searchUserAddress (address) {
            if (_.isEmpty(address)) {
                return;
            }
            let parsedAddress = address.split(' ').join('+');
            // console.log('searchUserAddress ', parsedAddress);
            let { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${parsedAddress}&key=AIzaSyAEx2xbRdw-ecd6pXRFtXmCaeHukaNnM7E`);

            if (data.status === 'OK') {
                this.searchedAddress = data.results[0].formatted_address;

                this.getWeather(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);

            }
            console.log('searchUserAddress: ', parsedAddress, data);
        },

        search () {
            console.log('search', this.searchField);
            this.searchUserAddress(this.searchField);

            this.searchHistory.push(this.searchField);
            this.searchHistoryBar = false;
            this.clearSearch();
        },

        clearSearch () {
            this.searchField = null;
            this.searchHistoryBar = false;
        },

        clearWeather () {
            this.weatherData.city = null;
            this.weatherData.country = null;
            this.weatherData.weather = [];

            this.searchHistoryBar = false;
        },

        aroundTemperature (temperature) {
            return Math.round(temperature);
        },
    },

    mounted() {
        this.getUserLocation();
        // this.getWeather();
    },
};
</script>
