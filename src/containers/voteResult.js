import React,{useState,useEffect,useContext} from 'react'
import {useHistory,useParams,Prompt,useLocation} from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Send from "@material-ui/icons/Send"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import {UserContext} from '../utils/ReducerContext'
import { hexTostring } from '../utils/utils';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import '../App.css';
import { DataGrid } from '@material-ui/data-grid';
import {getTime} from "../utils/utils"


function VoteResult() {
    const {uState,accounts,web3,contract} = useContext(UserContext);    
    const [voteID,setVoteID] = useState("");
    const [content, setContent] = useState("");
    const [candidate,setCandidate] = useState([]);
    const [topic,setTopic] = useState("");
    const {id} = useParams();
    const history = useHistory();
    useEffect(()=>{
        const fetchDate = async()=>{
            if(voteID === ""){
                var ID = id;
                setVoteID(ID);
                // console.log(ID);
                await getResultInfo(ID);
            }
        }
        fetchDate();
    },[id])
    // TODO: to get information about the vote by id
    const getResultInfo = async (voteID) =>{
        // contract here
        //new
        var _together = await contract.methods.getVoteResult(voteID).call();
        var _topic = _together[0];
        var _content = _together[1];
        var _cand = _together[2];
        var _bal = _together[3];
        //console.log(_together);
        var _candidates = [];
        for(var i = 0;i<_cand.length;i+=1){
            var _num = hexTostring(_cand[i]);
            var c = {
                id:i,
                order:i+1,
                name: _num,
                bal: _bal[i]
            }
            _candidates = [..._candidates,c];
        }
        if(!getTime){
            history.push('/')
            return 
        }
        setTopic(_topic);
        setContent(_content);
        setCandidate(_candidates);
        //console.log(_bal);
    }
    // end 
    const column = [
        {field:'order',headerName:'Number',width:130},
        {field:'name',headerName:'Candidate',width:160},
        {field:'bal',headerName:'votes',width:130}
    ]
    const updateView = (
        <DataGrid rows={candidate} columns={column} pageSize={10}/>
        
    );
    const backHome=()=>{
        history.push("/")
    }
    return(
        <Container>
            <Paper variant="outlined" style={{margin:20}}>
                <Grid container direction="column" justify="center" alignItems="center" style={{margin:20}} spacing={1}>
                    <Grid item xs><p style={{fontFamily:"Times",fontSize:50}}>{topic}</p></Grid>
                    <Grid item xs><p>{content}</p></Grid>
                    <Paper style={{height:400,width:450}} xs={6}>
                        {updateView}
                    </Paper>
                </Grid>
            </Paper>
            <Button style={{float:"right",margin:10}} color='primary' variant="contained" size="large" onClick={()=>{backHome()}}><HomeTwoToneIcon/></Button>
        </Container>
    )

}

export default VoteResult;