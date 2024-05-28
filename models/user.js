document.addEventListener('DOMContentLoaded', (event) => {
    updateMachineStatus();
});

function updateMachineStatus() {
    var machineStatus = {
        washer1: { active: false, course: '-', remainingTime: '-' },
        washer2: { active: true, course: '표준세탁', remainingTime: '00:06:32' },
        washer3: { active: false, course: '-', remainingTime: '-' },
        washer4: { active: true, course: '이불세탁', remainingTime: '00:45:06' },
        dryer1: { active: true, course: '중온', remainingTime: '00:15:48' },
        dryer2: { active: false, course: '-', remainingTime: '-' },
        dryer3: { active: false, course: '-', remainingTime: '-' },
        dryer4: { active: false, course: '-', remainingTime: '-' }
    };

    for (var machine in machineStatus) {
        var element = document.getElementById(machine);
        var status = machineStatus[machine];
        
        if (status.active) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }

        element.querySelector('.course').innerText = '코스 ' + status.course;
        element.querySelector('.time').innerText = '잔여시간 ' + status.remainingTime;
    }
}