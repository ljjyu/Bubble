const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    Branch = db.branch,
    { Op } = require('sequelize'),
    { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

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
        const { machineType, branchName, reservationTime } = req.body; // Update to match the correct keys
        const reservationNumber = uuidv4(); // Generate a unique reservation number

        // 예약 시간이 현재 시간보다 과거인지 확인
         const currentTime = new Date();
         const reservationDateTime = new Date(reservationTime);
         if (reservationDateTime < currentTime) {
              return res.status(400).send({
                    message: "예약 시간은 현재 시간보다 이후여야 합니다."
              });
         }
         // 지점 ID 확인
         const branchID = await Branch.findOne({ where: { branchName: branchName } });
         if (!branchID) {
            return res.status(400).send({
                message: "존재하지 않는 지점입니다."
            });
         }
         // 이용 가능한 기기 조회
        const availableMachines = await Machine.findAll({
            where: {
                branchID: branch.branchID,
                type: machineType,
                state: 'available'
            }
        });
         if (availableMachines.length === 0) {
            return res.status(400).send({
                message: "이용 가능한 기기가 없습니다."
            });
        }
        // 랜덤으로 기기 선택
        const randomMachine = availableMachines[Math.floor(Math.random() * availableMachines.length)];
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const userName = user ? user.name : 'Unknown User';

        const newReservation = await Reservation.create({
            reservationDate: reservationTime, // Store reservationTime as reservationDate
            machineID: randomMachine.machineID,
            subscriberName: userName // 사용자의 이름 저장
        });

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
