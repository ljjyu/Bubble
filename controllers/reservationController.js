const db = require("../models/index");
const Reservation = db.reservation;
const { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll();
        console.log(data);
        res.render("userHome", { reservations: data });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { machineType, machineNumber, reservationTime } = req.body;
        const reservationNumber = uuidv4(); // Generate a unique reservation number

        const newReservation = await Reservation.create({
            reservationNumber,
            usageTime: reservationTime, // 예약 시간을 문자열로 저장
            reservationDate: new Date(reservationTime), // 예약 날짜를 Date 객체로 저장
            Location: `${machineType} ${machineNumber}`
        });

        res.redirect("/getReservation");
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
