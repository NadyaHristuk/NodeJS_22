import React, { Component } from 'react';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import WeatherToday from './WeatherToday';
import './App.css';
import Search from './Search';
import { Promise } from 'rsvp';
import DefaultCityImg from './DefaultCityBG.jpg';

const WEATHER_KEY = 'eb51365df3129ba81aad6378ef1b2628';
const IMAGE_KEY = '7986301-c14a62fbcda5a08a22ab81f9a';

class App extends Component {
	state = {
		isLoading: true,
		cityName: 'Kiev',
		query: 'Kiev, Ukraine',
		bgIMG: '',
		lat: 50.25,
		lng: 30.3,
		weather_icons: 'https://assets.weatherstack.com/images/symbol.png',
		weather_descriptions: 'Overcast',
		wind_speed: 0,
		pressure: 0,
		precip: 0,
		temp_c: 0
	};

	getInfoMapClick = (e) => {
		let lat = e.latLng.lat();
		let lng = e.latLng.lng();
		console.log(lat, lng);
		const { numForecastDay } = this.state;
		const URL = `http://api.apixu.com/v1/forecast.json?key=${WEATHER_KEY}&q=${lat},${lng}`;
		console.log(URL);
		axios
			.get(URL)
			.then((res) => {
				return res.data;
			})
			.then((data) => {
				this.setState(
					{
						isLoading: false,
						cityName: data.location.name,
						country: data.location.country,
						lat: data.location.lat,
						lng: data.location.lon,
						query: data.request.query,
						temp_c: data.current.temp_c,
						text: data.current.condition.text,
						iconUrl: data.current.condition.icon
					},
					() => this.searchImages()
				);
			})
			.catch((err) => {
				if (err) console.error('Cannot fetch Weather Data from API', err);
			});
	};

	searchImages() {
		const { cityName } = this.state;

		// const URL = `https://pixabay.com/api/?key=${IMAGE_KEY}&q=${cityName}`;
		const URL = `http://localhost:3002/images`;
		console.log(URL);
		axios
			.post(URL, { city: cityName })
			.then((res) => {
				return res.data;
			})
			.then((data) => {
				if (data.hits.length === 0) {
					this.setState({
						bgIMG: DefaultCityImg
					});
				} else {
					this.setState({
						bgIMG: data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL
					});
				}
			});
	}

	updateWeather() {
		const { cityName } = this.state;
		// const URL = `http://api.apixu.com/v1/forecast.json?key=${WEATHER_KEY}&q=${cityName}&days=${numForecastDay}`;
		const URL = 'http://localhost:3002/weather';
		axios
			.post(URL, { city: cityName })
			.then((res) => {
				return res.data;
			})
			.then((data) => {
				this.setState({
					isLoading: false,
					lat: data.location.lat,
					lng: data.location.lon,
					country: data.location.country,
					temp_c: data.current.temperature,
					weather_descriptions: data.current.weather_descriptions,
					iconUrl: data.current.weather_icons,
					wind_speed: data.current.wind_speed,
					pressure: data.current.pressure,
					precip: data.current.precip,
					query: data.request.query
				});
				console.log(data);
			})
			.catch((err) => {
				if (err) console.error('Cannot fetch Weather Data from API', err);
			});
	}

	componentDidMount() {
		this.updateWeather();
		this.searchImages();
	}

	updateWeatherAndImage(value) {
		const { cityName } = this.state;
		let UpWeather = axios.get(`https://pixabay.com/api/?key=${IMAGE_KEY}&q=${cityName}`, { city: cityName });
		let UpImg = axios.get(`http://api.weatherstack.com/forecast?access_key=${WEATHER_KEY}&query=${cityName}`, {
			city: cityName
		});
		Promise.all([ UpWeather, UpImg ]).then((res) => {
			// console.log(res);
			this.setState({
				isLoading: false,
				bgIMG: res[1].data.hits[0].largeImageURL,
				cityName: res[0].data.location.name,
				lat: res[0].data.location.lat,
				lng: res[0].data.location.lon,
				country: res[0].data.location.country,
				temp_c: res[0].data.current.temperature,
				text: res[0].data.current.condition.text,
				iconUrl: res[0].data.current.weather_icons,
				weather_descriptions: res[0].data.current.weather_descriptions,
				wind_speed: res[0].data.current.wind_speed,
				pressure: res[0].data.current.pressure,
				precip: res[0].data.current.precip,
				query: res[0].data.request.query
			});
		});
	}
	cityNameUpdate = (e) => {
		e.preventDefault();
		// console.log(e.target.city.value);
		this.setState(
			{
				cityName: e.target.city.value
			},
			() => this.updateWeatherAndImage(this.state.cityName)
		);
		e.target.city.value = '';
		// console.log(this.state.cityName);
	};

	render() {
		const {
			cityName,
			isLoading,
			temp_c,
			weather_descriptions,
			iconUrl,
			lng,
			lat,
			query,
			bgIMG,
			wind_speed,
			pressure,
			precip,
			country
		} = this.state;
		console.log(this.state);
		return (
			<div>
				{isLoading ? (
					<div className="wrap">
						<div className="wrapLoader">
							<Loader type="Circles" color="#bbb" height="80" width="80" margin="100px" />
						</div>
					</div>
				) : (
					<div
						className="bgImage"
						style={{
							backgroundImage: `linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.1)
    ),url(${bgIMG})`
						}}
					>
						<h1 className="title">Real-Time World Weather App</h1>
						<Search className="search" getInput={this.cityNameUpdate} />
						<WeatherToday
							className="weather_block"
							cityName={cityName}
							temp_c={temp_c}
							text={weather_descriptions}
							iconUrl={iconUrl}
							lat={lat}
							lng={lng}
							country={country}
							query={query}
							wind_speed={wind_speed}
							pressure={pressure}
							precip={precip}
							getInfo={this.getInfoMapClick}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default App;
