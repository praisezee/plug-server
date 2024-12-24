const axiosInstance = require( 'axios' );


const axios = axiosInstance.create( {
      baseURL: process.env.API_URL,
      withCredentials: true,
      // withXSRFToken: true,
      headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
      },
})
