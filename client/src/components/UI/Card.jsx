import React from 'react';
import './Card.css'; // Assuming you will create a CSS file for styling

const Card = (props) => {
    return (
        <div className="card">
            {props.children}
        </div>
    );
};

export default Card;