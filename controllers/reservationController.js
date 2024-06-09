const db = require("../models/index");
const Reservation = db.reservation;
//Op =db.Sequelize.Op;
const { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll();
        console.log(data);
        //res.render("getReservation", { reservations: data });
        res.render("user/userReserve", { reservations: data });
        //res.render("reviews/getReservation", {reservations: data});
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { machineType, machineNumber, reservationTime } = req.body; // Update to match the correct keys
        const reservationNumber = uuidv4(); // Generate a unique reservation number
        //const reservationDate=new Date(reservationTime); //안 되면 지움 0610
        const newReservation = await Reservation.create({
            reservationNumber,
            machineType: machineType,
            reservationDate: reservationTime, // Store reservationTime as reservationDate
            machineNum: machineNumber // Store machineNumber as Location
        });

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }

    //여기서부터 잔여시간 수정한 부분! 
};exports.getRemainingTime = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const reservation = await Reservation.findByPk(reservationId);

        if (!reservation) {
            return res.status(404).send({
                message: "Reservation not found"
            });
        }

        const currentTime = new Date();
        const reservationTime = new Date(reservation.reservationDate);
        const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
        const elapsedTime = currentTime - reservationTime;
        const remainingTime = fifteenMinutes - elapsedTime;

        res.status(200).send({
            remainingTime: remainingTime > 0 ? remainingTime : 0 // Return remaining time or 0 if negative
        });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
// 수정 금지 !!!!!!