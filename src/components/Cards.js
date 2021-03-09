import React, { Component } from 'react';
import './Cards.css';

export const Event_Competitor = ({ competitor }) => {
    const { position, firstName, lastName, profile, prevPosition } = competitor;
    const ld = position.toString()[position.toString().length - 1];
    return <div className={`event_user`}>
        <div className='event_user_position'>
            <h4>{position}<label>{ld == 1 ? 'st' : ld == 2 ? 'nd' : ld == 3 ? 'rd' : 'th'}</label></h4>
            {prevPosition < position && prevPosition !== null ? <CaretDown color='#de0000' /> : <CaretUp color='#00de3b' />}
        </div>
        <img className='event_user_profilePic' src={profile} />
        <div className='event_user_details'>
            <div className='event_user_details_fullName'>
                <label>{firstName} {lastName}</label>
            </div>
        </div>
    </div>
}

const CaretDown = ({ color }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} className="bi bi-caret-down-fill" viewBox="0 0 16 16">
    <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
</svg>
const CaretUp = ({ color }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={color} className="bi bi-caret-up-fill" viewBox="0 0 16 16">
    <path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
</svg>