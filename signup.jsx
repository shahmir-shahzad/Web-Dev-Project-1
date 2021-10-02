import React, { Component } from 'react';
import * as userService from '../userService';
import axios from 'axios';
import Joi from 'joi-browser';

class SignUp extends React.Component {

    state = { data : { username : "", password : "" , email : "" , phone : "", userType : "admin" },
    errors : {}
    }

    schema = {
        username: Joi.string().required().min(5).label('username') , 
        password: Joi.string().required().min(5).label('password'),
        email: Joi.string().required().email().label('email'),
        phone: Joi.number().required().min(7).label('phone'),
        userType: Joi.string().required()
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

        //Error handling
        const errors = this.state.errors;
        const errorMessage = this.validateProperty(input);

        if(errorMessage){
            errors[input.name] = errorMessage;
        }
        else {
            delete errors[input.name];
        }

        //Data Handling
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
        //console.log(errors);
        if (errors)
            return;

        try{
            //const response = await userService.register(this.state.data);
            // window.location="/";
            e.preventDefault();
            const response = await axios.post('http://localhost:3000/user/signup',this.state.data);
            if(response.status == 200 && response.data)
            {
                console.log(response.data);
                window.location="/";
            }
        }
        catch(ex){
            if (ex.response && ex.response.status === 400){
                const errors = { ...this.state.errors};
                errors.username = ex.response.data;
                this.setState({errors});
                console.log(ex.response.data);
            }
        }
    }

    render() { 

        const submitButtonStyle = {
            marginTop: '20px'
          };

        return (
        <div className="container mt-20">
            <h1>Sign Up</h1>

            <form className="col-xs-12 col-md-5" onSubmit={e=>this.doSubmit(e)}>
            <div className="form-group">
                <label htmlFor="text">Username</label>
                <input onChange={this.handleChange} name="username" type="text" className="form-control" />
                {this.state.errors["username"] && <div className="alert alert-danger">{this.state.errors['username']}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input onChange={this.handleChange} type="email" className="form-control" name="email" />
                {this.state.errors["email"] && <div className="alert alert-danger">{this.state.errors['email']}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input onChange={this.handleChange} type="tel" className="form-control" name="phone" />
                {this.state.errors["phone"] && <div className="alert alert-danger">{this.state.errors['phone']}</div>}
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input onChange={this.handleChange} type="password" className="form-control" name="password" />
                {this.state.errors["password"] && <div className="alert alert-danger">{this.state.errors['password']}</div>}
            </div>
            <button style={submitButtonStyle} type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
        );
    }
}
 
export default SignUp;