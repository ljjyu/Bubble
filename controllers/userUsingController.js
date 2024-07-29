const db = require("../models/index"),
    Machine = db.machine,
    Reservation = db.reservation,
    Branch = db.branch,
    moment = require('moment'),
    Op = db.Sequelize.Op;

exports.getUserUsingPage = async (req, res) => {
    try {
        // 로그인된 사용자의 정보를 가져옵니다.
        const user = req.session.user;
        const subscriberName = user ? user.name : 'Unknown User';

        // 오늘의 시작과 끝 시간을 계산
        const startOfToday = moment().startOf('day').toDate();
        const endOfToday = moment().endOf('day').toDate();

        const reservations = await Reservation.findAll({
            where: {
                subscriberName: subscriberName,
                reservationDate: {
                    [Op.between]: [startOfToday, endOfToday] // 오늘 날짜 범위 필터링
                }
            },
            order: [['created_at', 'DESC']],
            include: [{
                model: Machine,
                as: 'machine',
                include : [{
                    model: Branch,
                    as: 'branch3'
                }],
                where: {
                    state: 'in_use' // Machine의 상태가 'in_use'인 경우만 조회
                }
            }]
        });

        // 렌더링할 페이지와 데이터
        res.render('user/userUsing', {
            reservations: reservations,
            currentTime: currentTime,
            startOfToday: startOfToday,
            endOfToday: endOfToday
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: '사용자 예약 정보를 불러오는 중 오류가 발생했습니다.'
        });
    }
};
