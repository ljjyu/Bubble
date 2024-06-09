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
};

//여기서부터 잔여시간 수정한 부분! 
exports.getUserUsingPage = async (req, res) => {
    try {
        const userId = req.user.id; // 사용자 ID를 가져옴

        const reservations = await Reservation.findAll({
            where: {
                userId: userId
            }
        });

        const userReservations = reservations.map(reservation => {
            const { machineType, machineNum, reservationDate, remainingTime } = reservation;
            return {
                id: `${machineType}${machineNum}`,
                remainingTime: remainingTime ? moment(remainingTime, 'HH:mm:ss').format('HH:mm:ss') : null
            };
        });

        res.render('userUsing', { reservations: userReservations });
    } catch (err) {
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
// 수정 금지 !!!!!!