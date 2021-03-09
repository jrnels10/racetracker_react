import React, { Component } from 'react'

export const LeaderBoard = ({ children }) => {
    return (
        <div className={`leaderBoard`}>
            <div className={`leaderBoard_title`}>
                <h3>Leaderboard</h3>
            </div>
            {children}
        </div>
    )
}
