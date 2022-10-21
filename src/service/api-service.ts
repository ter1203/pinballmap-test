import { BASE_URL, httpClient } from "./http-client"

export const PinballMapApis = {
  getClosetLocations: async (params: any) => {
    return await httpClient.get(`${BASE_URL}locations/closest_by_lat_lon.json`, params)
  },
  getAllLocations: async () => {
    return await httpClient.get(`${BASE_URL}locations/locations.json`)
  }
}