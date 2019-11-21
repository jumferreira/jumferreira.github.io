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
                <div class="columns">
                    <div class="column">
                        <div class="content">
                            <div class="content__left">
                                <div class="location" >
                                    <div v-if="currentAddress">
                                        <strong>Sua localização atual é:</strong>
                                        <p v-text="currentAddress"></p>
                                    </div>

                                    <div v-else>
                                        <strong>Localização não fornecida</strong>
                                    </div>

                                    <br />
                                    <strong v-if="searchedAddress">Último resultado obtido:</strong>
                                    <p v-text="searchedAddress"></p>
                                </div>


                                <div
                                    v-if="searchHistory.length"
                                    class="location_history"
                                >
                                    <strong>Histórico de busca:</strong>

                                    <ul>
                                        <li
                                            v-for="(item, index) in searchHistory"
                                            :key="index"
                                            v-text="item"
                                        ></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="content__right">
                                <div class="weather">
                                    <p class="weather__title">As informações do clima no momento:</p>

                                    <div class="weather__box" v-if="weatherData.weather">
                                        <div class="weather__box-header">
                                            <p v-text="cityName"></p>
                                            <p v-text="getCurrentTime"></p>
                                            <p
                                                v-if="currentWeatherData"
                                                v-text="currentWeatherData.title"
                                            ></p>
                                        </div>

                                        <div class="weather__box-body">
                                            <div class="weather__box-body_left">
                                                <img
                                                    v-if="currentWeatherData"
                                                    v-lazy="currentWeatherData.icon"
                                                    alt="weather"
                                                >
                                                <p
                                                    v-if="currentWeatherData"
                                                    v-text="currentWeatherData.temp + '°C'"
                                                ></p>
                                            </div>

                                            <div
                                                v-if="currentWeatherData"
                                                class="weather__box-body_right"
                                            >
                                                <p v-text="'Encoberto: ' + currentWeatherData.clouds + '%'"></p>
                                                <p v-text="'Umidade: ' + currentWeatherData.humidity + '%'"></p>
                                                <p v-text="'Vento: ' + currentWeatherData.windSpeed + 'km/h'"></p>
                                            </div>
                                        </div>

                                        <div class="weather__box-next-days">
                                            <ul class="weather__items">
                                                <li
                                                    class="weather__item"
                                                    v-for="(weather, index) in weatherData.weather"
                                                    :key="index"
                                                >
                                                    <p v-text="weather.dateTime"></p>
                                                    <img v-lazy="weather.icon" alt="">
                                                    <p v-text="currentWeatherData.temp + '°C'"></p>
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
import moment from 'moment';
import weather from '../utils/weather';

export default {
    mixins: [
        weather,
    ],

    data: () => ({
        weatherData: {
            city: null,
            country: null,
            weather: [],
        },

        searchHistoryBar: false,

        searchField: null,
        searchHistory: [],
        searchedAddress: null,
        currentAddress: null,
    }),

    computed: {
        getCurrentTime () {
            return moment().format('HH:mm:ss');
        },

        getCurrentDate () {
            return moment().format('DD-MM-YYYY');
        },

        cityName () {
            if (this.weatherData.city && this.weatherData.country) {
                return this.weatherData.city  + ' - ' + this.weatherData.country;
            }

            return '';
        },

        currentWeatherData() {
            if (this.weatherData.weather) {
                return this.weatherData.weather[0];
            }
        }
    },

    methods: {
        getClosestHour () {
            const hourRangesFromApi = [0, 3, 6, 9, 12, 15, 18, 21];
            const hour = moment().hour();

            return hourRangesFromApi.reduce(function(previous, current) {
                return (Math.abs(current - hour) < Math.abs(previous - hour) ? current : previous);
            });
        },

        parseWeather (data) {
            this.clearWeather();

            this.weatherData.city = data.city.name;
            this.weatherData.country = data.city.country;

            const filteredList = _.filter(data.list, item => {
                return moment(item.dt_txt).hour() === this.getClosestHour();
            });

            _.forEach(filteredList, item => {
                const weatherItem = {
                    clouds: item.clouds.all,
                    humidity: item.main.humidity,
                    temp: this.aroundTemperature(item.main.temp),
                    dateTime: this.getParsedDate(item.dt_txt),
                    title: item.weather[0].main,
                    icon: this.iconUrl(item.weather[0].icon),
                    windSpeed: this.windSpeedParsed(item.wind.speed),
                };

                this.weatherData.weather.push(weatherItem);
            });
        },

        async getWeather (latitude, longitude) {
            const { data } = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    lat: latitude,
                    lon: longitude,
                    units: 'metric',
                    appid: 'b077652524e83bc12498a0846b5f135d',
                }
            });

            this.parseWeather(data);
        },

        getUserLocation () {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                this.getAddressFromCoordenates(latitude, longitude);
            });
        },

        async searchUserAddress (address) {
            if (_.isEmpty(address)) {
                return;
            }

            const parsedAddress = address.split(' ').join('+');
            const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: parsedAddress,
                    key: 'AIzaSyAEx2xbRdw-ecd6pXRFtXmCaeHukaNnM7E',
                }
            });

            if (data.status === 'OK') {
                this.searchedAddress = data.results[0].formatted_address;
                const latitude = data.results[0].geometry.location.lat;
                const longitude = data.results[0].geometry.location.lng;

                this.getWeather(latitude, longitude);
            }
        },

        async getAddressFromCoordenates (lat, lon) {
            const stringCoord = lat + ',' + lon;
            const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: stringCoord,
                    result_type: 'street_address',
                    key: 'AIzaSyAEx2xbRdw-ecd6pXRFtXmCaeHukaNnM7E',
                }
            });

            if (data.status === 'OK') {
                this.currentAddress = data.results[0].formatted_address;

                const latitude = data.results[0].geometry.location.lat;
                const longitude = data.results[0].geometry.location.lng;

                this.getWeather(latitude, longitude);
            }
        },

        search () {
            this.searchUserAddress(this.searchField);

            this.searchHistory.push(this.searchField);
            this.clearSearch();
        },
    },

    mounted() {
        this.getUserLocation();
    },
};
</script>
