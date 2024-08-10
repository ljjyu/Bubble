const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    Branch = db.branch,
    { Op } = require('sequelize'),
    { v4: uuidv4 } = require('uuid'),
    moment = require('moment'),
    cron = require('node-cron');

//exports.getAllReservations = async (req, res) => {
//    try {
//        const data = await Reservation.findAll({
//            include: {
//                model: db.machine,
//                as: 'machine' // Machine 모델을 include
//            },
//            order: [['created_at', 'DESC']]
//        });
//        res.render("user/userReserve", { reservations: data });
//    } catch (err) {
//        res.status(500).send({
//            message: err.message
//        });
//    }
//};
//
//exports.createReservation = async (req, res) => {
//    try {
//        const { machineType, branchName, reservationTime } = req.body;
//        const reservationNumber = uuidv4();
//
//        const currentTime = moment();
//        const reservationDateTime = moment(reservationTime);
//        if (reservationDateTime.isBefore(currentTime)) {
//           return res.status(400).send({
//               message: "예약 시간은 현재 시간보다 이후여야 합니다."
//           });
//        }
//
//         // 지점 ID 확인
//         const branch = await Branch.findOne({ where: { branchName: branchName } });
//         if (!branch) {
//            return res.status(400).send({
//                message: "존재하지 않는 지점입니다."
//            });
//         }
//
//        // 해당 지점 기기 조회
//        const availableMachines = await Machine.findAll({
//            where: {
//                branchID: branch.branchID,
//                type: machineType
//            }
//        });
//        // 예약 시간의 3분 전과 3분 후를 계산
//        const reservationDateTimeMinus3Min = reservationDateTime.clone().subtract(3, 'minutes');
//        const reservationDateTimePlus3Min = reservationDateTime.clone().add(3, 'minutes');
//
//        // 이미 예약된 기기를 제외한 이용 가능한 기기 필터링
//        const reservedMachines = await Reservation.findAll({
//            where: {
//                reservationDate: { [Op.between]: [reservationDateTimeMinus3Min.toDate(), reservationDateTimePlus3Min.toDate()] },
//                machineID: availableMachines.map(machine => machine.machineID)
//            }
//        });
//
//        const reservedMachineIDs = reservedMachines.map(reservation => reservation.machineID);
//        const machinesNotReserved = availableMachines.filter(machine => !reservedMachineIDs.includes(machine.machineID));
//
//        if (machinesNotReserved.length === 0) {
//            return res.status(400).send({
//                message: "이용 가능한 기기가 없습니다."
//            });
//        }
//        // 랜덤으로 기기 선택
//        const randomMachine = machinesNotReserved[Math.floor(Math.random() * machinesNotReserved.length)];
//
//        // 로그인된 사용자의 정보를 가져옵니다.
//        const user = req.session.user;
//        const userName = user ? user.name : 'Unknown User';
//
//        const newReservation = await Reservation.create({
//            reservationDate: reservationTime, // Store reservationTime as reservationDate
//            machineID: randomMachine.machineID,
//            subscriberName: userName // 사용자의 이름 저장
//        });
//
//        const cronTimeInUse = reservationDateTime.format('m H D M *');
//        //예약 생성 후, 해당 machineID의 state 속성을 'in_use'로 업데이트
//        cron.schedule(cronTimeInUse, async () => {
//            try {
//                await Machine.update(
//                    { state: 'in_use' },
//                    {
//                        where: { machineID: randomMachine.machineID }
//                    }
//                );
//                console.log(`Machine ${randomMachine.machineID} has been set to in_use.`);
//            } catch (err) {
//                console.error(`Error updating machine ${randomMachine.machineID} to in_use:`, err.message);
//            }
//        }, {
//            scheduled: true,
//            timezone: "Asia/Seoul"
//        });
//
//        const cronTimeAvailable = reservationDateTimePlus3Min.format('m H D M *');
//
//        cron.schedule(cronTimeAvailable, async () => {
//            try {
//                await Machine.update(
//                    { state: 'available' },
//                    {
//                        where: { machineID: randomMachine.machineID }
//                    }
//                );
//                console.log(`Machine ${randomMachine.machineID} has been set to available.`);
//            } catch (err) {
//                console.error(`Error updating machine ${randomMachine.machineID} to available:`, err.message);
//            }
//        }, {
//            scheduled: true,
//            timezone: "Asia/Seoul"
//        });
//
//        res.status(201).send(newReservation);
//    } catch (err) {
//        res.status(500).send({
//            message: err.message
//        });
//    }
//};

module.exports = (io) => {
    return {
        createReservation: async (req, res) => {
            try {
                const { machineType, branchName, reservationTime } = req.body;
                const reservationNumber = uuidv4();

                const currentTime = moment();
                const reservationDateTime = moment(reservationTime);
                if (reservationDateTime.isBefore(currentTime)) {
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

                // 해당 지점 기기 조회
                const availableMachines = await Machine.findAll({
                    where: {
                        branchID: branch.branchID,
                        type: machineType
                    }
                });
                // 예약 시간의 3분 전과 3분 후를 계산
                const reservationDateTimeMinus3Min = reservationDateTime.clone().subtract(3, 'minutes');
                const reservationDateTimePlus3Min = reservationDateTime.clone().add(3, 'minutes');

                // 이미 예약된 기기를 제외한 이용 가능한 기기 필터링
                const reservedMachines = await Reservation.findAll({
                    where: {
                        reservationDate: { [Op.between]: [reservationDateTimeMinus3Min.toDate(), reservationDateTimePlus3Min.toDate()] },
                        machineID: availableMachines.map(machine => machine.machineID)
                    }
                });

                const reservedMachineIDs = reservedMachines.map(reservation => reservation.machineID);
                const machinesNotReserved = availableMachines.filter(machine => !reservedMachineIDs.includes(machine.machineID));

                if (machinesNotReserved.length === 0) {
                    return res.status(400).send({
                        message: "이용 가능한 기기가 없습니다."
                    });
                }
                // 랜덤으로 기기 선택
                const randomMachine = machinesNotReserved[Math.floor(Math.random() * machinesNotReserved.length)];

                // 로그인된 사용자의 정보를 가져옵니다.
                const user = req.session.user;
                const userName = user ? user.name : 'Unknown User';

                const newReservation = await Reservation.create({
                    reservationDate: reservationTime, // Store reservationTime as reservationDate
                    machineID: randomMachine.machineID,
                    subscriberName: userName // 사용자의 이름 저장
                });

                const cronTimeInUse = reservationDateTime.format('m H D M *');
                //예약 생성 후, 해당 machineID의 state 속성을 'in_use'로 업데이트
                cron.schedule(cronTimeInUse, async () => {
                    try {
                        await Machine.update(
                            { state: 'in_use' },
                            {
                                where: { machineID: randomMachine.machineID }
                            }
                        );
                        console.log(`Machine ${randomMachine.machineID} has been set to in_use.`);
                    } catch (err) {
                        console.error(`Error updating machine ${randomMachine.machineID} to in_use:`, err.message);
                    }
                }, {
                    scheduled: true,
                    timezone: "Asia/Seoul"
                });

                // 알림 스케줄링
                const reservationDateTimePlus2Min = reservationDateTime.clone().add(2, 'minutes');
                const cronTimeNotification = reservationDateTimePlus2Min.format('m H D M *');

                cron.schedule(cronTimeNotification, () => {
                    try {
                        io.emit("notification", {
                            message: "사용 완료 시간 1분 전입니다."
                        });
                        console.log("Notification sent to user");
                    } catch (err) {
                        console.log("Failed to send notification:", err.message);
                    }
                }, {
                    scheduled: true,
                    timezone: "Asia/Seoul"
                });

                const cronTimeAvailable = reservationDateTimePlus3Min.format('m H D M *');

               cron.schedule(cronTimeAvailable, async () => {
                   try {
                       await Machine.update(
                            { state: 'available' },
                            {
                                where: { machineID: randomMachine.machineID }
                            }
                       );
                       console.log(`Machine ${randomMachine.machineID} has been set to available.`);
                   } catch (err) {
                       console.error(`Error updating machine ${randomMachine.machineID} to available:`, err.message);
                   }
               }, {
                    scheduled: true,
                    timezone: "Asia/Seoul"
               });

               res.status(201).send(newReservation);
            } catch (err) {
                res.status(500).send({
                    message: err.message
                });
           }
        },
        getAllReservations: async (req, res) => {
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
        }
    };
};

