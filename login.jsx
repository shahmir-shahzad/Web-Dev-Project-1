import React, { Component } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import {Redirect } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Joi from 'joi-browser';

class LogIn extends React.Component {
    state = { data : { username : "", password : ""},
    errors : {}
    }

    schema = {
        username: Joi.string().required().min(5).label('username') , 
        password: Joi.string().required().min(5).label('password')
    };

    validateProperty = ({name,value})=> {
        const obj = { [name] : value };
        const schema = { [name] : this.schema[name]};

        // console.log(obj);
        // console.log(schema);

        const { error } = Joi.validate(obj,schema);
        return error ? error.details[0].message : null;

    }

    handleChange = ({currentTarget : input}) => {

        //error handling
        const errors = this.state.errors;
        const errorMessage = this.validateProperty(input);

        if(errorMessage){
            errors[input.name] = errorMessage;
        }
        else {
            delete errors[input.name];
        }

        //Data handling
        const data = {...this.state.data};
        data[input.name] = input.value;
        this.setState({data: data}); 
    }

    validate = () => {

        const options = {abortEarly : false};
        const {error} = Joi.validate(this.state.data,this.schema,options);
        
        if(!error)
            return null;

        const errors = {};
        for(let item of error.details){
            errors[item.path] = item.message;
        }

        return errors;
    }

    doSubmit = async (e) =>{

        //Error Handling
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors : errors || {}});
        if (errors)
            return;

        try{
            //const response = await userService.register(this.state.data);
            // window.location="/";

            const tokenKey = "token";
            const response = await axios.post('http://localhost:3000/user/login',this.state.data);
            if(response.status == 200 && response.data)
            {
                console.log("in login "+response.data.token);
                //Saving the token in localstorage
                await localStorage.setItem(tokenKey,response.data.token);

                this.props.history.push('/home');
            }
        }
        catch(ex){
            if (ex.response && ex.response.status === 401){
                alert('Invalid user or password');
                
                // const errors = { ...this.state.errors};
                // errors.username = ex.response.data;
                // this.setState({errors});
                // console.log(ex.response.data);
            }
        }
    }

    // componentDidMount() {
    //     try{
    //         const jwt = localStorage.getItem('token');
    //         const user = jwtDecode(jwt);
    //         if(user)
    //         {
    //              window.location="/home";
    //         }
    //     }
    //     catch(ex){
    //         console.log("Not Logged In");
    //     }
    // }

    render(){

        const registerButtonStyle = {
            display: 'flex',
            marginTop: '30px',
            float: 'right'
          };

        return ( 
            <div className="container mt-20">
                <div>
                    <button style={registerButtonStyle} className="btn btn-primary" onClick={()=>{this.props.history.push("/signup")}}>SignUp</button>
                </div>

                <h1>Log In Form</h1>
                
                <form className="col-xs-12 col-md-5" onSubmit={e=>this.doSubmit(e)}>
                <div className="form-group">
                    <label  htmlFor="username">Username</label>
                    <input onChange={this.handleChange} type="text" className="form-control" name="username" />
                    {this.state.errors["username"] && <div className="alert alert-danger">{this.state.errors['username']}</div>}
                </div>
                <div className="form-group">
                    <label  htmlFor="password">Password</label>
                    <input onChange={this.handleChange} type="password" className="form-control" name="password" />
                    {this.state.errors["password"] && <div className="alert alert-danger">{this.state.errors['password']}</div>}
                </div>
                {/* <div className="checkbox">
                    <label><input type="checkbox" /> Remember me</label >
                </div> */}
                <button type="submit" className="btn btn-primary submitbutton" >Submit</button>
                </form>
    
            </div>
         );

    }
}
 
export default withRouter(LogIn);