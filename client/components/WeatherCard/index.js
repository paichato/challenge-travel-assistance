import React from 'react'
import styles from './styles.module.css'
import Divider from '../Divider'

function WeatherCard() {
  return (
    <div className={styles.weatherContainer}>
<div>

<h1 className={styles.weatherText}>24 C</h1>
<p>Sunny</p>
</div>
<img src='/assets/sunny.png'/>
  <Divider/>
<div>
<h1>
  Cidade de Maputo
</h1>
<p>
  Mocambique
</p>
</div>
  <Divider/>
<div>
<h1>
  Quarta feira
</h1>
<p>
  2 de Agosto de 2023
</p>
</div>
</div>
  )
}

export default WeatherCard