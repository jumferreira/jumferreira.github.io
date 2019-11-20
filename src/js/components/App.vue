<template>
    <div class="main">
        <div class="header">
            <div class="container">
                <div class="columns items-center">
                    <div class="column logo_column">
                        <h1 class="header__logo">
                            <!-- <a href="https://site.blueticket.com.br/">
                                <img class="header__image" src="https://images.assets-landingi.com/0Vj6dch8/logo-blueticket-color.png" alt="">
                            </a> -->
                        </h1>
                    </div>

                    <div class="column">
                        <div class="header__search">
                            <div class="header__search-holder">
                                <input
                                    type="text"
                                    class="input input--grey-darker input--75"
                                    placeholder="Busca por endereços"
                                    v-model="searchField"
                                    @keyup="search()"
                                >

                                <i
                                    v-if="isClearSearchActive"
                                    class="fas fa-times"
                                    @click="clearSearch()"
                                ></i>
                            </div>
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
                                    <!-- colocar endereço -->
                                </div>

                                <div class="location_history">
                                    Histórico de busca:

                                    <ul>
                                        <li>Rua Péricles Fechio, 54</li>
                                    </ul>
                                    <!-- fazer v-for com histórico -->
                                </div>
                            </div>

                            <div class="content__right">
                                <div class="weather">
                                    <p class="weather__title">As informações do clima no momento:</p>

                                    <div class="weather__box">
                                        <div class="weather__box-header">
                                            <p v-text="weatherData.cityName"></p>
                                            <p v-text="weatherData.title"></p>
                                        </div>

                                        <div class="weather__box-body">
                                            <div class="weather__box-body_left">
                                                <img :src="iconUrl" alt="weather">
                                                <p>
                                                    {{ aroundTemperature(weatherData.temp) + '°C' }}
                                                </p>
                                            </div>

                                            <div class="weather__box-body_right">
                                                <p>Chuva: {{ weatherData.rain }}%</p>
                                                <p>Umidade: {{ weatherData.humidity }}%</p>
                                                <p>Vento: {{ windSpeedParsed }}km/h</p>
                                            </div>
                                        </div>

                                        <div class="weather__box-next-days">
                                            <ul class="weather__items">
                                                <li class="weather__item">
                                                    <p>dia</p>
                                                    <p>icon</p>
                                                    <p>max/min</p>
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
        // userLocation: {
        //     latitude: 0,
        //     longitude: 0,
            // altitude: 0,
            // accuracy: 0,
            // altitudeAccuracy: 0,
            // heading: 0,
            // speed: 0,
            // timestamp: 0,
        // },

        weatherData: {
            cityName:"Bauru",
            clouds:0,
            humidity:78,
            icon:"01n",
            maxTemp:22.22,
            minTemp:22.22,
            rain: 0,
            temp:22.22,
            title:"Clear",
            windSpeed:4.47,


            // title: null,
            // temp: 0,
            // maxTemp: 0,
            // minTemp: 0,
            // humidity: 0,
            // windSpeed: 0,
            // rain: 0,
            // clouds: 0,
            // cityName: null,
            // icon: null,
        },

        isLoading: false,
        searchField: null,
        isClearSearchActive: false,
        searchHistory: [],
    }),

    computed: {
        iconUrl () {
            return `https://openweathermap.org/img/wn/${this.weatherData.icon}@2x.png`;
        },

        windSpeedParsed () {
            return Math.round(this.weatherData.windSpeed * 3.6);
        },
    },

    methods: {
        async getWeather (latitude, longitude) {

            // certo
            // let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b077652524e83bc12498a0846b5f135d`);

            // console.log('getWeather: ', data);
            // this.weatherData.cityName = data.name;
            // this.weatherData.title = data.weather[0].main;
            // this.weatherData.icon = data.weather[0].icon;
            // this.weatherData.temp = data.main.temp;
            // this.weatherData.maxTemp = data.main.temp_max;
            // this.weatherData.minTemp = data.main.temp_min;
            // this.weatherData.humidity = data.main.humidity;
            // this.weatherData.windSpeed = data.wind.speed;
            // this.weatherData.rain = _.isEmpty(data.rain)
                // ? 0
                // : data.rain;
            // this.weatherData.clouds = data.clouds.all;

            // {
            //     "coord": {
            //         "lon":-49.06,
            //         "lat":-22.33
            //     },

            //     "weather": [
            //         {
            //             "id":802,
            //             "main":"Clouds",
            //             "description":"scattered clouds",
            //             "icon":"03n"
            //         }
            //     ],

            //     "base":"stations",
            //     "main": {
            //         "temp":23.33,
            //         "pressure":1017,
            //         "humidity":75,
            //         "temp_min":23.33,
            //         "temp_max":23.33
            //     },
            //     "wind": {
            //         "speed":3.58,
            //         "deg":123,
            //         "gust":6.26
            //     },

            //     "rain":{},
            //     "clouds": {
            //         "all":29 // % de nublado
            //     },
            //     "dt":1574212401,
            //     "sys":{
            //         "type":3,
            //         "id":53165,
            //         "country":"BR",
            //         "sunrise":1574151874,
            //         "sunset":1574199533
            //     },
            //     "timezone":-10800,
            //     "id":3470279,
            //     "name":"Bauru",
            //     "cod":200
            // }
        },

        getUserLocation () {
            navigator.geolocation.getCurrentPosition(position => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                this.getWeather(latitude, longitude);
            });
        },

        async searchUserAddress (address) {
            let parsedAddress = address.replace('', '+');

            let { data } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${parsedAddress}&key=AIzaSyAEx2xbRdw-ecd6pXRFtXmCaeHukaNnM7E`);
            console.log('searchUserAddress: ', data);
        },

        search: _.throttle(function () {

        }, 500),

        clearSearch () {
            // this.searchField = null;
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
