import React,{useContext,useState, useEffect} from 'react'
import {UserContext} from '../utils/ReducerContext'
import Button from '@material-ui/core/Button'
import {useHistory} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import { stringToHex,hexTostring } from '../utils/utils';
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"
//import { console } from 'node:console'


function Profile() {
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const history = useHistory();
    const [idSetting,setIdSetting] = useState(false);
    const [id,setID] = useState("");
    const [v,setV] = useState(true);
    const [errorMessage,setErrorMessage] = useState("");
    const [hintMessage,setHintMessage] = useState("");
    // TODO:
    useEffect(()=>{
        const fetchId = async() =>{
            const hexId = await contract.methods.getId(accounts[0]).call();    // get ID by address
            const _id = hexTostring(hexId);
            if (_id !== ""){
                uDispatch({type:'LOGIN',payload:{UserId:_id,isManager:uState.isManager,isLogin:true}})   
                setID(_id);
            }
        }
        fetchId();
    },[])
    const verifyID = async () => {
        if(v){
            // check if anyone use the same ID
            // pass in id, get boolean, true if have the same ID, otherwise false
            var hexId = stringToHex(id);
            var isRepeat = await contract.methods.checkId(hexId).call();
            if (isRepeat){
                setV(false)
                setErrorMessage("This id has been registried");
            }
            else{
                setV(true)
                setHintMessage("This ID is useable!");
            } 
            // here need to change
        }
    }
    const confirm = async () =>{
        // check if anyone use the same ID first
        // if false then break
        if (!v) return
        var hexId = stringToHex(id);
        var isRepeat = await contract.methods.checkId(hexId).call();
        if (isRepeat){
            setV(false);
            setErrorMessage("This id has been registried");
            return;
        }
        console.log(accounts[0]);
        console.log(hexId);
        var old_Id = await contract.methods.checkIfChangeId(accounts[0]).call();
        console.log(old_Id);
        if (old_Id == "0x0000000000000000000000000000000000000000000000000000000000000000"){
            await contract.methods.addNewVoter(hexId,accounts[0]).send({from:accounts[0],gas: 600000});
            setHintMessage("you have registed successfully!")
        }else{
            await contract.methods.changeId(hexId,accounts[0]).send({from:accounts[0],gas: 600000});           
            setHintMessage("you have change ID successfully!")
        }
        // await contract.methods.addNewVoter(hexId,accounts[0]).send({from:accounts[0],gas: 600000});
        uDispatch({type:'LOGIN',payload:{UserId:id,isManager:uState.isManager,isLogin:true}}) // isManager need to change when demo
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
        if(value===""){
            setV(false);
            setErrorMessage("cannot be empty");
        }
        if (value.indexOf(' ') >= 0){
            setV(false);
            setErrorMessage("cannot contain space in ID");
            return;
        }
        setV(true);
        setErrorMessage("");
    }
    return (
        <Container maxWidth="lg" style={{margin:20}}>
            <Paper variant="outlined">
                <Grid container direction="column" justify="center" alignItems="center" style={{margin:20}} spacing={3}>
            <p> UserID: {uState.id}</p>
            {idSetting?(<Grid item container direction="column" justify="center" alignItems="center"  spacing={3} >{v?(<TextField label="set ID" placeholder="Customer" value={id} onChange={(e)=>{noSpace(e.target.value);setHintMessage("")}}/>):
                    (<TextField error label="set ID" value={id} helperText={errorMessage} onChange={(e)=>{noSpace(e.target.value);setHintMessage("")}}/>)}
                <Grid item container direction="row" justify="center" alignItems="center"  spacing={3}>
                    <Button onClick={()=>{verifyID()}} variant="outlined" style={{margin:10}}>Verify</Button>
                    <Button onClick={()=>{confirm()}} variant="outlined" style={{margin:10}}>Confirm</Button>
                </Grid>
            </Grid>):(<><Button onClick={()=>{setting()}} variant="outlined">set ID</Button></>)}
                {hintMessage}
                </Grid> 
            </Paper>
        </Container>
    );
}

export default Profile;