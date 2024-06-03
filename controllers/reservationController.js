/*const db = require("../models/index"),
    Reservation = db.reservation,
    Op = db.Sequelize.Op;

exports.getAllReservations = async (req, res) => {
    try {
        data = await Reservation.findAll();
        console.log(data);
        res.render("getReservation", {reservations: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};

const db = require("../models/index");
const Reservation = db.reservation;
const { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll();
        console.log(data);
        res.render("getReservation", {reservations: data});
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { usageTime, reservationDate, Location } = req.body;
        const reservationNumber = uuidv4(); // Generate a unique reservation number

        const newReservation = await Reservation.create({
            reservationNumber,
            usageTime,
            reservationDate,
            Location
        });

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
}; */
const db = require("../models/index");
const Reservation = db.reservation;
const { v4: uuidv4 } = require('uuid');

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        res.render("getReservation", { reservations });
    } catch (err) {
        console.error("Error retrieving reservations:", err);
        res.status(500).send({
            message: "Error retrieving reservations"
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { usageTime, reservationDate, Location } = req.body;

        // 입력 유효성 검사
        if (!usageTime || !reservationDate || !Location) {
            return res.status(400).send({ message: "Usage time, reservation date, and location are required." });
        }

        const reservationNumber = uuidv4(); // Generate a unique reservation number

        const newReservation = await Reservation.create({
            reservationNumber,
            usageTime,
            reservationDate,
            Location
        });

        res.status(201).send(newReservation);
    } catch (err) {
        console.error("Error creating reservation:", err);
        res.status(500).send({
            message: "Error creating reservation"
        });
    }
};

