import * as L from "leaflet";
import { courseCompleted } from "../leaflet/LeafletMain";

export class EventCompetitor {
    constructor({
        id = null,
        firstName = '',
        lastName = '',
        email = '',
        prevPosition = null,
        position = 0,
        lap = 1,
        profile = 'https://storage.googleapis.com/grandmas-recipes/coco_cuddles.jpg',
        latitude = 0,
        longitude = 0,
        speed = 0,
        raceNumber = 0,
        totalCompleted = 0
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.prevPosition = prevPosition;
        this.position = position;
        this.lap = lap;
        this.profile = profile;
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        this.newLap = false;
        this.raceNumber = raceNumber;
        this.totalCompleted = totalCompleted;
        this.marker = new L.Marker([this.latitude, this.longitude], {
            rotationAngle: 100
        }).bindPopup(`<label>${firstName} ${lastName}</label>`);
    }

    updateLocation = ({ latitude, longitude, speed }) => {
        this.latitude = latitude;
        this.longitude = longitude;
        this.speed = speed;
        return this;
    };
    getCourseCompleted = (track, courseLength, totalCourseLength) => {
        const trackCompleted = courseCompleted(track, [this.latitude, this.longitude]).properties.location;
        // console.log(this.lap, trackCompleted)
        console.log(`${this.firstName} - ${(trackCompleted / courseLength * 100).toFixed(2)}% completed`)
        if ((trackCompleted / courseLength * 100).toFixed(2) > 95 && !this.newLap) {
            console.log('finished lap')
            this.newLap = true;
            ++this.lap;
        }
        if ((trackCompleted / courseLength * 100).toFixed(2) < 10 && this.newLap) {
            this.newLap = false
        }
        this.totalCompleted = (((trackCompleted * this.lap) / totalCourseLength) * 100).toFixed(2);
        return this.totalCompleted;
    }
    setRacePosition = (advanced) => {
        this.prevPosition = this.position;
        this.position = advanced ? --this.position : ++this.position;
    }
};