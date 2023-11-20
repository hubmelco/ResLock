import Constants from "expo-constants"

const getEnv = () => {
    const {NODE_ENV} = process.env

    if (NODE_ENV === "development"){
        return 'dev';
    } else if (NODE_ENV === "production"){
        return 'prod';
    }
}

const isLocal = getEnv() === 'dev';
const isProd = getEnv() === 'prod';


const getAPIEndpoint = () => {
    if (isProd){
        return 'our prod url'
    }

    const { manifest } = Constants;

    if (manifest.debuggerHost) {
        return `http://${manifest.debuggerHost.split(`:`).shift().concat(`:5000`)}`
    }

    return "http://localhost:5000"
}

const environment = {
    APIEndpoint: getAPIEndpoint(),
    env: getEnv(),
    isLocal,
    isProd
}

export default environment