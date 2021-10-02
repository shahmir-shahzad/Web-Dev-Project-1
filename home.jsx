import React, { Component } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { withRouter } from 'react-router-dom';


class Home extends React.Component {


    state = {products : [],username:""}

    

    async componentDidMount() {
        const token = localStorage.getItem("token");
        // console.log("first try "+ token)
        // console.log("start of cdm "+localStorage.getItem("token"));
        const response  = await axios.get('http://localhost:3000/product/list',{headers: {
            Authorization: `Bearer ${token}`
        }});
        const products = response.data.products;
        this.setState({products});
        
        let user=jwtDecode(token);
        let name = user.username;
        this.setState({username : name});
        console.log(user);


    }

    logOut=()=>{
        if(localStorage.getItem('token'))
        {

            localStorage.removeItem('token');
            this.props.history.push("/");
        }
    }

    

    render() { 

        const logoutButtonStyle = {
            display: 'flex',
            flexDirection: 'row',
            marginTop: '10px',
            justifyContent: 'right',
            alignItems: 'flex-end',
            marginBottom: '20px'
          };

        return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'right'}}>
                <button style={logoutButtonStyle} className="btn btn-primary" onClick={()=>this.logOut()}>LogOut</button>
            </div>
            <h1>Welcome to the homepage, {this.state.username} !</h1>
            <div  style={{width: "70%"}}>
                <table size="sm" className="table table-dark producttable">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.products.map(item => 
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                            </tr>
                        )}

                    </tbody>

                </table>
            </div>
        </div>);
    }
}
 
export default withRouter(Home);