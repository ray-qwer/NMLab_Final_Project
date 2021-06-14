import React,{useContext,useState} from 'react'
import {UserContext} from '../utils/ReducerContext'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
function Profile() {
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const history = useHistory();
    const [idSetting,setIdSetting] = useState(false);
    const [id,setID] = useState("");
    const [v,setV] = useState(true);
    const [errorMessage,setErrorMessage] = useState("");
    // TODO:
    const verifyID = async () => {
        if(v){
            // check if anyone use the same ID
            // pass in id, get boolean, true if no one have the same ID, otherwise false
            setV(false);    // here need to change
        }
    }
    const confirm = async () =>{
        // check if anyone use the same ID first
        // if false then break
        
        uDispatch({type:'LOGIN',payload:{UserId:id,isManager:true,isLogin:true}})
        setIdSetting(false);
    }
    const setting = async () =>{
        // check if this address has id before
        // if yes then cannot set ID again
        setIdSetting(true);
    }
    // 
    const noSpace = async (value) =>{
        setID(value);
        if (value.indexOf(' ') >= 0){
            setV(false);
            setErrorMessage("cannot contain space in ID");
            return;
        }
        setV(true);
        setErrorMessage("");
    }
    return (
        <div>
            <p> UserID: {uState.id}</p>
            {uState.isLogin?(<></>):(<>
                <Button onClick={()=>{history.push("/LogIn")}}>Log in</Button>
                
            </>)}
            {idSetting?(<div>{v?(<TextField label="set ID" placeholder="Customer" value={id} onChange={(e)=>{noSpace(e.target.value)}}/>):
                    (<TextField error label="set ID" value={id} helperText={errorMessage} onChange={(e)=>{noSpace(e.target.value)}}/>)}
                <div>
                    <div><Button onClick={()=>{verifyID()}} variant="outlined">Verify</Button></div>
                    <div><Button onClick={()=>{confirm()}} variant="outlined">Confirm</Button></div>
                </div>
            </div>):(<><Button onClick={()=>{setting()}}>set ID</Button></>)}
        </div>
    );
}

export default Profile;