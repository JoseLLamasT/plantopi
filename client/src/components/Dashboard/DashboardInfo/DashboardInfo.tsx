import React from 'react';
import { IGetArea } from 'types/areaInterfaces';

import TopCard from 'components/Cards/TopCard/TopCard';
import BottomCard from 'components/Cards/BottomCard/BottomCard';
import SensorCard from 'components/Cards/SensorCard/SensorCard';
import styles from './DashboardInfo.module.scss';
import ScheduleCard from 'components/Cards/ScheduleCard/ScheduleCard';
import { fetchCurrentWeather } from 'services/apiWeather/apiWeather';
import { useEffect, useState } from 'react';
import { ICurrentWeather } from 'types/weatherInterfaces';
import { socket } from 'context/socket';
import { ISensorReading } from 'types/sensorsInterfaces';

const DashboardInfo: React.FC<{ selectedArea: IGetArea | undefined }> = ({ selectedArea }) => {
  let [currentWeather, setCurrentWeather] = useState<ICurrentWeather>();
  let [currentHumidity, setCurrentHumidity] = useState<number>(0);

  // AREA ID HARDCODED IN CURRENT WEATHER FETCH BELOW - SWAP WITH AREAID LATER
  useEffect(() => {
    const initializeWeather = async () => {
      try {
        const weather = await fetchCurrentWeather('1');
        if (weather.cod === 401) throw new Error();
        setCurrentWeather(weather);
      } catch (err) {
        console.log('Could not initialize current weather.');
      }
    };
    initializeWeather();
  }, []);

  useEffect(() => {
    socket.on('sensors', listener);
    function listener (sensorData: ISensorReading) {
      let currentArea = selectedArea;
      sensorDataHandler(sensorData, currentArea);
    }

    return (() => {socket.removeEventListener('sensors', listener);});

  }, [selectedArea]);

  console.log('selected area outside handler');
  console.log(selectedArea);

  function sensorDataHandler (sensorData: ISensorReading, currentArea: IGetArea |undefined) {
    console.log('selected area inside handler');
    console.log(currentArea);
    if (!currentArea) return;

    // console.log('id from server:');
    // console.log(sensorData.sensorId);
    // console.log('id from selected');
    // console.log(selectedArea);
    // console.log(sensorData.sensorId === selectedArea.sensors[0].iotId);

    if (sensorData.sensorId[6] === currentArea.id.toString()) {
      console.log('sensordata id:');
      console.log(sensorData.sensorId[6]);
      console.log('selectedarea id:');
      console.log(currentArea.id);
      setCurrentHumidity(sensorData.value);
    }
  }

  return (
    <div className={styles.container}>
      <TopCard title={selectedArea ? selectedArea.name : ''}>
        {/*TODO <SensorCard id={area.sensors[0].id} name={area.sensors[0].name} type={area.sensors[0].type} reading={area.sensors[0].value} /> */}
        <SensorCard id="1" name="Humidity" type="humidity" reading={currentHumidity} />
        {/*TODO <SensorCard id={area.sensors[1].id} name={area.sensors[1].name} type={area.sensors[1].type} reading={area.sensors[1].value} /> */}

        <SensorCard id="2" name="Temperature" type="temperature" reading={Math.round(currentWeather?.current.temp)} />
      </TopCard>
      <BottomCard>
        {/* TODO controllerId={areas[selectedArea].controllers[0].id} type issue */}
        <ScheduleCard controllerId="1" controllerTopic="pump1" currentWeather={currentWeather} />
      </BottomCard>
    </div>
  );
};

export default DashboardInfo;
