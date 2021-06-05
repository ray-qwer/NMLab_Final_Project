import React,{useContext} from 'react'
import {Link,BrowserRouter as Router,useHistory} from 'react-router-dom';
import GoogleCircleFilled from '@ant-design/icons/GoogleCircleFilled'
import Button from '@material-ui/core/Button' 
import {Googlelogin} from '../utils/helloUtils'
import hello from 'hellojs'
import {UserContext} from '../utils/ReducerContext'

function LogIn() {
    const {uDispatch} = useContext(UserContext);
    const getLoginInfo = () =>{
        uDispatch({type:'LOGIN',payload:{UserId:"ray",isManager:true,isLogin:true}})
    }
    let history = useHistory()
    const LoginClick = async () =>{
        await Googlelogin();
        hello('google').api('me').then(function(json){
            console.log(json)
            getLoginInfo();
        })
            
        history.push('/',{login:true});
    }
    return (
            <div className="LoginLobby">
                <Button color="primary" variant="contained" startIcon={<GoogleCircleFilled/>} onClick={()=>LoginClick()}>Log In with Google</Button>
            </div>
    )
}

export default LogIn;