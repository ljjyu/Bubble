// worker.js
const reservationQueue = require('./queue'),
    db = require("../models/index"),
    Machine = db.machine;

// 큐 작업 처리
reservationQueue.process(async job => {
    const { machineID } = job.data;

    try {
        // 기계 상태를 'available'로 변경
        await Machine.update(
            { state: 'available' },
            { where: { machineID } }
        );
        console.log(`Machine ${machineID} has been set to available.`);
    } catch (err) {
        console.error(`Error updating machine ${machineID} to available:`, err.message);
    }
});
