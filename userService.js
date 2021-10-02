import http from './httpService';
import {apiUrl} from "./config.json";

const apiEndpoint = apiUrl + '/user/signup';

export function register(user){
    return http.post(apiEndpoint, {
        username : user.username ,
        password : user.password,
        email : user.email,
        phone : user.phone,
        userType : user.userType
    });
}