import React from 'react';

const Input = ({type,name,label,value,error, onChange}) => {
    return ( 
    <div className="mb-3">
        <label htmlFor={name}>{label}</label>
        <input name={name} onChange={onChange} value={value} autoFocus id={name} type={type} className="form-control" />
        {error && <div className="alert alert-danger">{error}</div>}
    </div>
     );
}
 
export default Input;