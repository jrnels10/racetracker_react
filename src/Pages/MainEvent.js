import React, { Component } from 'react';
import { Event_Competitor } from '../components/Cards';
import Leafletmain from '../leaflet/LeafletMain';
import io from 'socket.io-client';

import './styles/MainEvent.css';
import { EventCompetitor } from '../models/EventCompetitor';
import { LeaderBoard } from '../components/LeaderBoard';


export default class MainEvent extends Component {
    socket = io('http://localhost:5000');
    state = {
        competitors: []
    };

    componentDidMount() {
        this.socket.on('connect', function (data) {
            console.log('data')
            console.log(data)
        });

        this.socket.on('marker', (data) => {
            const newCompetitors = this.state.competitors;
            data.map((user, i) => {
                const findCompetitor = this.state.competitors.find(c => c.id === user.id);
                if (!findCompetitor) {
                    user.position = ++i;
                    newCompetitors.push(new EventCompetitor({ ...user }));
                }
            });
            this.setState({ competitors: [...newCompetitors] });
        });

        this.socket.on('getAllMarkers', data => {
            data.map(competitor => {
                const found = this.state.competitors.find(c => c.id === competitor.id);
                if (found) {
                    found.updateLocation({ ...competitor });
                }
            });
        })

        setInterval(() => {
            this.setState({ competitors: this.state.competitors })
            this.socket.emit('getAllMarkers')
        }, 5000);
    }

    componentDidUpdate() {
        if (this.props.competitors.length !== this.state.competitors.length) {
            this.props.setCompetitors(this.state.competitors);
        }
    }

    render() {
        const { competitors } = this.state;
        return (
            <div className='main' >
                <div className={`main_map`}><Leafletmain competitors={competitors} setCompetitors={this.props.setCompetitors} /></div>
            </div>
        )
    }
}


export class MainEventContainer extends Component {
    state = {
        competitors: []
    }

    setCompetitors = (competitors) => {
        this.setState({ competitors })
    }

    render() {
        const { competitors } = this.state;
        console.log(competitors)
        return (
            <React.Fragment>
                <MainEvent setCompetitors={this.setCompetitors} competitors={competitors} />
                <div className='sidebar'>
                    <LeaderBoard>
                        {
                            competitors.map((u, i) => <Event_Competitor key={i} competitor={u} >
                            </Event_Competitor>)
                        }
                    </LeaderBoard>
                </div>
            </React.Fragment>
        )
    }
}