import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PinballMapApis } from 'service/api-service';
import { StoreValue } from 'types/recipe';
import MainLayout from '../layouts/MainLayout';
import { Box, Button, TextField } from '@mui/material';

const locationOptions = {
	enableHighAccuracy: false,
	timeout: 5000,
	maximumAge: 0,
}

/**
 * Simple test page
 * Latitude : 52.520007
 * Longtitude: 13.404954
 */
const Home: React.FC = () => {
  
  const recipes = useSelector((state: StoreValue) => state.recipeReducer.recipes)
  const dispatch = useDispatch()

  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [result, setResult] = useState('')
  
  const success = useCallback((pos: any) => {
		var coords = pos.coords
		let temp = { lat: coords.latitude, lng: coords.longitude }
    setLatitude(coords.latitude)
    setLongitude(coords.longitude)
		console.log('===> coords', temp)
	}, [])
  
	const errors = useCallback((err: any) => {
    console.log('===> error', err)
  }, [])
  
  const onAutoFillNearMe = useCallback(() => {
    if (navigator.geolocation) {
			if (navigator.permissions && navigator.permissions.query) {
				navigator.permissions
					.query({ name: "geolocation" })
					.then(function (result) {
						if (
							result.state === "granted" ||
							result.state === "prompt"
						) {
							navigator.geolocation.getCurrentPosition(
								success,
								errors,
								locationOptions
							)
						} else if (result.state === "denied") {
							console.log('===> denied')
						}
					})
			} else {
				navigator.geolocation.getCurrentPosition(
					success,
					errors,
					locationOptions
				)
			}
		} else {
      console.log('===> location not available')
		}
  }, [])
  
  const onSearch = useCallback(async () => {
    const result = await PinballMapApis.getClosetLocations({
      lat: latitude,
      lon: longitude
    })
    setResult(result)
    console.log('===> result', result)
  }, [])

  return (
    <MainLayout>
      <Box>
        <TextField
          id="latitude"
          label="Latitude"
          variant="outlined"
          sx={{ m: 2 }}
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}/>
        <TextField
          id="longtitude"
          label="Longtitude"
          variant="outlined"
          sx={{ m: 2 }}
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}/>
      </Box>
      <Box>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={onAutoFillNearMe}
        >
          Near Me
        </Button>
        <Button
          variant="outlined"
          sx={{ m: 2 }}
          onClick={onSearch}
        >
          Search
        </Button>
      </Box>
      <Box>
        <div><pre>{JSON.stringify(result, null, 2) }</pre></div>
      </Box>
    </MainLayout>
  );
};

export default Home;