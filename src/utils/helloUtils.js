import hello from 'hellojs'

hello.init({
    google:"1087638916183-av3k7jgngmnmincfdnf8b2589bvrapr1.apps.googleusercontent.com"
},{
    redirect_uri:'/'
})

async function Googlelogin(){
    console.log("hi")
    await hello('google').login().then(function(){
        console.log('getin')
    },function(e){
        console.log(e.error)
    })
}

async function Googlelogout(){
    console.log("leave")
    var ret;
    await hello('google').logout().then(function(){
        console.log('getout')
        ret = true;
    },function(e){
        console.log(e.error)
        ret = false;
    })
    return ret;
}


export {Googlelogin,Googlelogout};