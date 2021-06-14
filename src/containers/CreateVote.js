import React,{useContext,useState,Component} from 'react'
import {UserContext} from '../utils/ReducerContext'
import {Redirect} from 'react-router-dom'
import TextField from '@material-ui/core/TextField'
import  "../App.css"
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button'
import {stringToHex} from '../utils/utils'
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton'
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import InputBase from '@material-ui/core/InputBase'

function CreateVoting(){
    const {uState,accounts,web3,contract} = useContext(UserContext);
    const [topic,setTopic] = useState("");
    const [content,setContent] = useState("");
    const [candidates,setCandidates] = useState(["dd","ee"]);
    const [dueTime,setDueTime] = useState("");
    const [ballot,setBallot] = useState(1);
    const [whoCanVote,setWhoCanVote] = useState(["mm","nn"]);
    const [voter,setVoter] = useState("");
    const candidateList = candidates.map((c,i)=>
        <div key={i}>
            <span>Candidate {i+1}</span>
            <TextField value={c} placeholder={`Candidate ${i}`} variant="outlined" onChange={(e)=>{setCandidates([...candidates.slice(0,i),e.target.value,...candidates.slice(i+1)])}}/>
            <Button variant="contain" onClick={()=>{setCandidates([...candidates.slice(0,i),...candidates.slice(i+1)])}}><DeleteIcon/></Button>
        </div>
    )
    const canVoteList = whoCanVote.map((v,i)=>
        <div key={i}>
            <span>{v}</span>
            <Button variant="contain" onClick={()=>{setWhoCanVote([...whoCanVote.slice(0,i),...whoCanVote.slice(i+1)])}}><DeleteIcon/></Button>            
        </div>
    )
    const Click = () =>{
        
        console.log(dueTime)
    }
    const addVoter = () => {
        if (voter.indexOf(" ")>=0){
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
    const buildVote = async () =>{
        if(topic === "" || content === "" || dueTime === "" ||candidates.some((e)=>e==="")){
            alert("something is empty!!!")
            return
        }
        try{
            var time = dueTime.replace(/-/g,'/')
            time = time.replace(/T/,' ');
            time = time+':00'
        }catch(e){
            alert('error',e);
            return
        }
        console.log(time)
        // new!! convert to int 
        // var _topic,_content,_time;
        // _topic = stringToHex(topic);
        // _content = stringToHex(content);
        // _time = stringToHex(time);
        var stringCandidates = [];
        for(var i = 0;i<candidates.length;i+=1){
            var _num = stringToHex(candidates[i]);
            stringCandidates = [...stringCandidates,_num];
        }
        // 
        var stringCanVote =[];
        for(var i = 0;i<whoCanVote.length;i+=1){
            var _num = stringToHex(whoCanVote[i]);
            stringCanVote = [...stringCanVote,_num];
        }
        const vote = {
            topic: topic,
            content: content,
            DueTime: time,
            candidates: stringCandidates,
            ballot: ballot
        }
        console.log(vote);
        console.log(stringCanVote);
        // TODO:
        // throw "vote" to contract
        // await contract.methods.addVote(vote.topic,vote.content,vote.DueTime,vote.candidates,1).send({from:accounts[0],gas: 1500000,gasPrice: '30000000000000'});
    }
    return (
        <div>
            {uState.isManager?(
                <div className="CreateVoteList">
                    <div>
                        <p>Topic</p>
                        <TextField label="Topic" placeholder="Topic" variant="outlined" onChange={(e)=>{setTopic(e.target.value)}}/>
                    </div>
                    <div>
                        <p>Content</p>
                        <TextField label="Content" placeholder="Content" variant="outlined" onChange={(e)=>{setContent(e.target.value)}}/>
                    </div>
                    <div>
                        <p>Due Time</p>
                        <TextField type="datetime-local" onChange={(e)=>{setDueTime(e.target.value)}}/>
                    </div>
                    <div>
                        <p>amount of ballot</p>
                        <TextField type="number" value={ballot} inputProps={{min:0,max:candidates.length}} variant="outlined" onChange={(e)=>{setBallot(e.target.value)}}/>
                    </div>
                    <Paper elevation={0}>                   
                    {candidateList}
                    <Button onClick={()=>{setCandidates([...candidates,""])}} color="secondary" variant="contained">Add Candidate</Button>
                    </Paper>
                    <p> who has right to vote </p>
                    <Paper elevation={0}>
                    <InputBase placeholder="Add man/woman" onChange={(e)=>{setVoter(e.target.value)}} />
                    <IconButton onClick={()=>{addVoter()}}><AddBoxOutlinedIcon/></IconButton>
                    </Paper>
                    <Paper elevation={5}>
                    {canVoteList}
                    </Paper>
                    <Button onClick={()=>{buildVote()}} color="primary" variant="contained">Build a Vote</Button> 
                </div>
            ):(<Redirect to='/'/>)}
        </div>
    );
}

export default CreateVoting;