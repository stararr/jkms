import { loading } from "./blog.js"

/*var showLoadingMessages = window.setInterval(function(){
    document.getElementById('didyouknow').innerHTML="<b>did you know?</b> star"+loadingmessages[Math.round(Math.random()*(loadingmessages.length-1))];
}, 1250);*/


function onReady(callback) {
    var intervalId = window.setInterval(function() {
        if ((document.body !== undefined) && (loading==false)) {
            //window.clearInterval(showLoadingMessages);
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 7500);
}
  
function setVisible(id, visible) {
    document.getElementById('container').style.display='flex';
    document.getElementById(id).style.animation = 'loaded 2500ms ease-out';
    document.getElementById(id).addEventListener('animationend', () => {
        document.getElementById(id).style.display = visible ? 'flex' : 'none';
    })
}

onReady(function() {
    setVisible('loading-screen', false);
});

setVisible('loading-')