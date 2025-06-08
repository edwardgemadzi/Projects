const hour = document.getElementById('hour');
const minute = document.getElementById('minute');
const second = document.getElementById('second');


function clock(){
    setInterval(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        hour.innerText = `${hours}:`;
        minute.innerText =`${minutes}:`;
        second.innerText = `${seconds}`;
    }, 1000);
}
clock();