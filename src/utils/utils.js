function getTime (deadLine) {
    var DL = new Date(deadLine);
    var time = new Date();
    var diff = (DL - time);
    var countDown;
    if(diff >=0){
        var days = Math.floor(diff/(1000 * 60 * 60 * 24));
        var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countDown = {
            dd: days,
            hr: hours,
            mm: minutes,
            ss: seconds
        }
    }
    else{
        countDown = false;
    }
    return countDown;
}

export {getTime};