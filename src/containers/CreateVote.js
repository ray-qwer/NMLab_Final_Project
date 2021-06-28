import React,{useContext,useState,Component, useEffect} from 'react'
import {UserContext} from '../utils/ReducerContext'
import {Redirect,useHistory} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import  "../App.css"
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button'
import {stringToHex} from '../utils/utils'
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import InputBase from '@material-ui/core/InputBase'
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"
import Divider from "@material-ui/core/Divider"
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import Home from './Home';
import {getTime} from "../utils/utils"


function CreateVoting(){
    const {uState,accounts,web3,contract} = useContext(UserContext);
    const [topic,setTopic] = useState("");
    const [content,setContent] = useState("");
    const [candidates,setCandidates] = useState([]);
    const [dueTime,setDueTime] = useState("");
    const [ballot,setBallot] = useState(1);
    const [whoCanVote,setWhoCanVote] = useState([]);
    const [candid,setCandid] = useState("");
    const [voter,setVoter] = useState("");
    const [suc,setSuc] = useState(false);
    const history = useHistory();    
    useEffect(()=>{
        const check = async() =>{
            try{var _isManager = await contract.methods.checkIfManager().call({from:accounts[0]})
            if (!_isManager){
                history.push('/')
            }}catch(e){
                history.push('/')
            }
        }
        check()
    },[])
    const candidateList = candidates.map((c,i)=>
        <Grid key={i} container item direction="row" spacing={4} justify="center" className="CreateVoteListInputBlock">
            <Grid item xs={3}><div className="WordBlock"><div>Candidate {i+1}</div></div></Grid>
            <Grid item xs={6}>
                <TextField value={c} placeholder={`Candidate ${i}`} variant="outlined" onChange={(e)=>{setCandidates([...candidates.slice(0,i),e.target.value,...candidates.slice(i+1)])}}/>
                <Button onClick={()=>{setCandidates([...candidates.slice(0,i),...candidates.slice(i+1)])}} style={{float:"left"}}><DeleteIcon/></Button>
            </Grid>
        </Grid>
    )
    const canVoteList = whoCanVote.map((v,i)=>
        <Grid  item key={i}>
            <span>{v}</span>
            <Button onClick={()=>{setWhoCanVote([...whoCanVote.slice(0,i),...whoCanVote.slice(i+1)])}}><DeleteIcon/></Button>            
        </Grid>
    )
    const Click = () =>{
        
        console.log(dueTime)
    }
    const addVoter = () => {
        if (voter === ""){
            return
        }
        else if (voter.indexOf(" ")>=0){
            alert("illegal ID: no space in ID");
            return;
        }
        if(whoCanVote.findIndex((e)=>e==voter)<0){
            setWhoCanVote([...whoCanVote,voter]);
            setVoter("");
        }
        else {
            alert("the ID is added before");
            return;
        }

    }
    // TODO: 
    const buildVote = async() =>{
        var time;
        try{
            time = dueTime.replace(/-/g,'/')
            time = time.replace(/T/,' ');
            time = time+':00'
        }catch(e){
            alert('error',e);
            return
        }
        time = new Date(time).getTime();
        console.log(time)
        if(topic === "" || content === "" || dueTime === "" ||candidates.some((e)=>e==="")){
            alert("something is empty!!!")
            return
        }
        else if(!getTime(time)){
            alert("you can not create a vote in past!!")
            return
        }
        else if(ballot>candidates.length){
            alert("ballots cannot be more than candidates!!")
            return 
        }
        var stringCandidates = [];
        for(var i = 0;i<candidates.length;i+=1){
            var _num = stringToHex(candidates[i]);
            stringCandidates = [...stringCandidates,_num];
        }
        var stringCanVote =[];
        for(var i = 0;i<whoCanVote.length;i+=1){
            var _num = stringToHex(whoCanVote[i]);
            stringCanVote = [...stringCanVote,_num];
        }
        const vote = {
            topic: topic,
            content: content,
            DueTime: time,
            ballot: ballot,
            candidates: stringCandidates,
            voters: stringCanVote
        }
        
        console.log(vote);
        console.log(stringCanVote);
        // TODO:
        // throw "vote" to contract
        try{
            await contract.methods.addVote(vote.topic,vote.content,vote.DueTime,vote.voters,vote.candidates,vote.ballot).send({ from: accounts[0],gas: 6000000, }); //[]neeed change
        }catch(e){
            alert("someting wrong..., check console for more information")
            console.log(e)
            return
        }
        setSuc(true)

    }
    const reBuild=()=>{
        setBallot(1);
        setCandid("");
        setCandidates([])
        setContent("")
        setDueTime("");
        setTopic("");
        setVoter("");
        setWhoCanVote([])
        setSuc(false);
    }
    return (
        <Container maxWidth="lg">
            {uState.isManager?(<>
                {suc?(
                <Grid container direction="column" spacing={5} justify="flex-start" alignItems="center" className="CreateVoteList" style={{marginTop:20}}>
                    <Grid item>You have successfully created vote!!</Grid>
                    <Button onClick={()=>{reBuild()}} variant="outlined" style={{margin:5}}>reBuild</Button>
                    <Button onClick={()=>{history.push('/')}} variant="outlined" style={{margin:5}}>Home<HomeTwoToneIcon/></Button>              
                </Grid>):(
                <Grid container direction="column" spacing={5} justify="flex-start" className="CreateVoteList" style={{marginTop:20}}>
                    <Paper variant="outlined" style={{padding:20,margin:20}}>
                    <Grid container item direction="column" spacing={5} justify="center" >
                            <Grid container item direction="row" justify="center" alignItems="center" spacing={5} className="CreateVoteListInputBlock">
                                <Grid item xs={3} ><div className="WordBlock"><div>Topic</div></div></Grid>
                                <Grid item xs={6} >
                                    <TextField label="Topic" placeholder="Topic" variant="outlined" onChange={(e)=>{setTopic(e.target.value)}}/>
                                </Grid>
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center" spacing={5} className="CreateVoteListInputBlock">
                                <Grid item xs={3}><div className="WordBlock"><div>Content</div></div></Grid>
                                <Grid item xs={6} >
                                    <TextField  label="Content" placeholder="Content" variant="outlined" onChange={(e)=>{setContent(e.target.value)}}/>
                                </Grid>
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center" spacing={5} className="CreateVoteListInputBlock">
                                <Grid item xs={3}><div className="WordBlock"><div>Due Time</div></div></Grid>
                                <Grid item xs={6}>
                                    <TextField variant="outlined" type="datetime-local" onChange={(e)=>{setDueTime(e.target.value)}}/>
                                </Grid>
                            </Grid>
                            <Grid container item direction="row" justify="center" alignItems="center" spacing={5} className="CreateVoteListInputBlock">
                                <Grid item xs={3}><div className="WordBlock"><div>amount of ballot</div></div></Grid>
                                <Grid item xs={6}>
                                    <TextField type="number" value={ballot} inputProps={{min:0,max:candidates.length}} variant="outlined" onChange={(e)=>{setBallot(e.target.value)}}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Paper variant="outlined" style={{padding:20,margin:20}}>
                    <Grid container item direction="column" spacing={5} justify="center"  >               
                                <Grid container item direction="row" spacing={4} justify="center" className="CreateVoteListInputBlock">
                                    <Grid item xs={3}><div className="WordBlock"><div>Add Candidate</div></div></Grid>
                                    <Grid item xs={6}>
                                        <TextField value={candid} placeholder={`Candidate ${candidates.length+1}`} variant="standard"  onChange={(e)=>{setCandid(e.target.value)}} onKeyDown={(value)=>{if(value.keyCode==13){if(candid!=="")setCandidates([...candidates,candid]);setCandid("")}}}/>
                                        <Button onClick={()=>{if(candid!=="")setCandidates([...candidates,candid]);setCandid("")}} style={{float:"left",color:"darkblue"}}><AddBoxOutlinedIcon/></Button>
                                    </Grid>
                                </Grid>
                                <Divider variant="middle"  style={{background:"darkgray"}}/>
                                {candidateList}
                                
                    </Grid>
                    </Paper>
                    <Paper variant="outlined" style={{padding:20,margin:20}}>
                    <Grid container item direction="column" spacing={5} justify="center"  >
                        {/* <Paper variant="outlined"> */}
                                <Grid container item direction="row" spacing={4} justify="center" className="CreateVoteListInputBlock">
                                    <Grid item xs={3}><div className="WordBlock"><div>Add Voter</div></div></Grid>
                                    <Grid item xs={6}>
                                        <TextField placeholder="Add man/woman" value={voter} onChange={(e)=>{setVoter(e.target.value)}} onKeyDown={(value)=>{if(value.keyCode==13)addVoter()}}/>
                                        <Button onClick={()=>{addVoter()}} style={{float:"left",color:"darkblue"}}><AddBoxOutlinedIcon/></Button>
                                    </Grid>
                                </Grid>
                            {canVoteList}
                    </Grid>
                    </Paper>
                    <Grid item>
                        <Button onClick={()=>{buildVote()}} color="primary" variant="contained">Build a Vote</Button> 
                    </Grid>
                </Grid>
                )}
                </>
            ):(<Redirect to='/'/>)}
        </Container>
    );
}

export default CreateVoting;