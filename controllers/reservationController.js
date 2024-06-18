const db = require("../models/index"),
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    const { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll();
        console.log(data);
        res.render("user/userReserve", { reservations: data });
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

        // 예약 시간이 현재 시간보다 과거인지 확인
         const currentTime = new Date();
         const reservationDateTime = new Date(reservationTime);
         if (reservationDateTime < currentTime) {
              return res.status(400).send({
                    message: "예약 시간은 현재 시간보다 이후여야 합니다."
              });
         }
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const userName = user ? user.name : 'Unknown User';

        const newReservation = await Reservation.create({
            reservationNumber,
            machineType: machineType,
            reservationDate: reservationTime, // Store reservationTime as reservationDate
            machineNum: machineNumber // Store machineNumber as Location
            subscriberName: userName // 사용자의 이름 저장
        });

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
