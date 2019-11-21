import moment from 'moment';

export default {
    methods: {
        iconUrl (icon) {
            return `https://openweathermap.org/img/wn/${icon}@2x.png`;
        },

        windSpeedParsed (windValue) {
            return Math.round(windValue * 3.6);
        },

        getParsedDate (dateTime) {
            return moment(dateTime).format('DD-MM');
        },

        aroundTemperature (temperature) {
            return Math.round(temperature);
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
    },
}
