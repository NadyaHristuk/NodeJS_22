import React from 'react';
import Map from './Map';
import './WeatherToday.css';

const WeatherToday = ({
	temp_c,
	text,
	iconUrl,
	getInfo,
	lat,
	lng,
	query,
	cityName,
	country,
	wind_speed,
	pressure,
	precip
}) => (
	<div className="weather_animated">
		{console.log({ lat }, { lng }, { temp_c }, { wind_speed }, { pressure }, { precip })}
		<div className="location">
			<span data-api="location">{query}</span>
		</div>
		<div className="container">
			<div className="main_left">
				<i
					data-api="current_icon"
					className="night"
					style={{
						backgroundImage: `url(${iconUrl})`
					}}
				/>
				<span data-api="current_main_descr">{text}</span>
			</div>
			<div className="main_center">
				<span data-api="current_temperature" className="temperature">
					{temp_c}
				</span>
			</div>
			<div className="main_right">
				<span data-api="current_wind_speed" className="wind">
					Wind: {wind_speed} kmph
				</span>
				<span data-api="current_precip" className="precip">
					Precip: {precip} mm
				</span>
				<span data-api="current_pressure" className="pressure">
					Pressure: {pressure} mb
				</span>
			</div>
		</div>
		<div style={{ height: `450px`, width: '50%' }}>
			{/* <Map
				getInfo={getInfo}
				lat={lat}
				lng={lng}
				cityName={cityName}
				country={country}
				googleMapURL="https://maps.googleapis.com/maps/api/js?key=...."
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `22.5rem` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/> */}
		</div>
	</div>
);

export default WeatherToday;
