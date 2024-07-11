const db = require("../models/index"),
    cron = require('node-cron'),
    Machine = db.machine,
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    Branch = db.branch,
    { Op } = require('sequelize'),
    { v4: uuidv4 } = require('uuid'); // For generating unique reservation numbers

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll({
            include: {
                model: db.machine,
                as: 'machine' // Machine 모델을 include
            }
        });
        res.render("user/userReserve", { reservations: data });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
// CRON Job 설정: 매 분마다 실행
cron.schedule('* * * * *', async () => {
    try {
        const currentTime = new Date();

        // 1시간 전 시간을 계산합니다.
        //const oneHourAgo = new Date();
        //oneHourAgo.setHours(oneHourAgo.getHours() - 1);
         // 3분 전 시간을 계산합니다.
        const threeMinutesAgo = new Date();
        threeMinutesAgo.setMinutes(threeMinutesAgo.getMinutes() - 3);

        // 예약 시간이 지난 예약들을 조회합니다.
        const overdueReservations = await Reservation.findAll({
            where: {
                reservationDate: {
                    [Op.lt]: threeMinutesAgo
                }
            },
            include: {
                model: Machine,
                as: 'machine'
            }
        });

        // 예약 시간이 지난 경우 해당 기기의 상태를 'available'로 업데이트합니다.
        for (const reservation of overdueReservations) {
            await Machine.update(
                { state: 'available' },
                { where: { machineID: reservation.machine.machineID } }
            );
        }

        console.log('CRON Job 실행: 예약 시간이 지난 기기 상태를 업데이트했습니다.');
    } catch (error) {
        console.error('CRON Job 오류:', error);
    }
});
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
         const branch = await Branch.findOne({ where: { branchName: branchName } });
         if (!branch) {
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

        // 예약 생성 후, 해당 machineID의 state 속성을 'in_use'로 업데이트
        await Machine.update(
            { state: 'in_use' }, // 업데이트할 데이터
            {
                where: { machineID: randomMachine.machineID } // 조건
            }
        );

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
