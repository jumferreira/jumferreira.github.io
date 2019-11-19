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
                                    placeholder="Busca por coordenadas"
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
                            <h3>Bem vindo ao painel de busca de coordenadas e tempo <i class="fab fa-github"></i></h3>

                            <p>Para usar o buscador é muito simples!</p>
                            <br />

                            <p>Você pode autorizar o navegador a usar sua localização ou então digitar sua latitude e longitude (nessa ordem) e a previsão do tempo já vai aparecer bem aqui. Viu como é simples?</p>
                        </div> -->

                        <!--
                            - SALVAR HISTÓRICO DE BUSCA EM UM ARRAY
                            - CRIAR BUSCA OTIMIZADA COM ESSE ARRAY
                            - PEGAR TEMPERATURA PELA LOCALIZAÇÃO
                            - CACHEAR ESSES DADOS

                        -->
                        <div class="weather_list">
                            ajsjashjash
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
        userLocation: {
            latitude: 0,
            longitude: 0,
            altitude: 0,
            accuracy: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
            timestamp: 0,
        },

        isLoading: false,
        searchField: null,
        isClearSearchActive: false,
        searchHistory: [],
    }),

    // computed: {
    //
    // },

    methods: {
        // api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}

        async getWeather () {
            const latitude = this.userLocation.latitude;
            const longitude = this.userLocation.longitude;
            let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b077652524e83bc12498a0846b5f135d`);
            // let { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${this.userLocation.latitude}&lon=${this.userLocation.longitude}&appid=b077652524e83bc12498a0846b5f135d`);

            console.log(data);
        },

        getUserLocation () {
            navigator.geolocation.getCurrentPosition(position => {
                this.userLocation.latitude = position.coords.latitude;
                this.userLocation.longitude = position.coords.longitude;
                // this.userLocation.altitude = position.coords.altitude;
                // this.userLocation.accuracy = position.coords.accuracy;
                // this.userLocation.altitudeAccuracy = position.coords.altitudeAccuracy;
                // this.userLocation.heading = position.coords.height;
                // this.userLocation.speed = position.coords.speed;
                // this.userLocation.timestamp = position.timestamp;

                console.log(this.userLocation.latitude, this.userLocation.longitude);
            });
        },

        search: _.throttle(function () {
            //     this.isLoading = true;
            //     this.isClearSearchActive = true;
            //     this.isShowingInitialMessage = false;

            // if (this.searchField.length > 4) {
            //     this.isLoading = false;
            //     this.getUser(this.searchField);

            // } else {
            //     this.isClearSearchActive = false;

            // }
        }, 500),

        clearSearch () {
            // this.searchField = null;
        },
    },

    mounted() {
        this.getUserLocation();
        this.getWeather();
    },
};
</script>
