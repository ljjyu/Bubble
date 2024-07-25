const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    Subscriber = db.subscriber,
    Branch = db.branch,
    { Op } = require('sequelize'),
    { v4: uuidv4 } = require('uuid');

exports.getAllReservations = async (req, res) => {
    try {
        const data = await Reservation.findAll({
            include: {
                model: db.machine,
                as: 'machine' // Machine 모델을 include
            },
            order: [['created_at', 'DESC']]
        });
        res.render("user/userReserve", { reservations: data });
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { machineType, branchName, reservationTime } = req.body;
        const reservationNumber = uuidv4();

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

        // 해당 지점 기기 조회
        const availableMachines = await Machine.findAll({
            where: {
                branchID: branch.branchID,
                type: machineType
            }
        });
        // 예약 시간의 3분 전과 3분 후를 계산
        const reservationDateTimeMinus5Min = new Date(reservationDateTime.getTime() - 3 * 60 * 1000);
        const reservationDateTimePlus5Min = new Date(reservationDateTime.getTime() + 3 * 60 * 1000);

        // 이미 예약된 기기를 제외한 이용 가능한 기기 필터링
        const reservedMachines = await Reservation.findAll({
            where: {
                reservationDate: { [Op.between]: [reservationDateTimeMinus5Min, reservationDateTimePlus5Min] },
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

        //예약 생성 후, 해당 machineID의 state 속성을 'in_use'로 업데이트
        await Machine.update(
            { state: 'in_use' }, // 업데이트할 데이터
            {
                where: { machineID: randomMachine.machineID } // 조건
            }
        );
        const reservationEndTime = reservationDateTime.getTime() + 3 * 60 * 1000;
        const timeUntilUpdate = reservationEndTime - currentTime.getTime();

        // 예약 시간 3분 후에 상태를 'available'로 변경하는 작업 예약
        setTimeout(async () => {
            try {
                await Machine.update(
                    { state: 'available' }, // 업데이트할 데이터
                    {
                        where: { machineID: randomMachine.machineID } // 조건
                    }
                );
                console.log(`Machine ${randomMachine.machineID} has been set to available.`);
            } catch (err) {
                console.error(`Error updating machine ${randomMachine.machineID} to available:`, err.message);
            }
        }, timeUntilUpdate);

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};
