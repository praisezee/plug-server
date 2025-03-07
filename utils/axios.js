const axiosInstance = require( 'axios' );


const axios = axiosInstance.create( {
      baseURL: process.env.API_URL,
      withCredentials: true,
      // withXSRFToken: true,
      headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Pepsa-Wallet':"12$zJszMDDPi8pzRznn48AaLuYESHdlioaN1Z1U4DoN7dpL3ODn3gmbS"
      },
} )

const dispatchAxios = axiosInstance.create( {
      baseURL: process.env.DISPATCH_URL,
      withCredentials: true,
      // withXSRFToken: true,
      headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Pepsa-Wallet':"$2y$12$zJszMDDPi8pzRznn48AaLuYESHdlioaN1Z1U4DoN7dpL3ODn3gmbS"
      },
})

module.exports = {axios,dispatchAxios};

