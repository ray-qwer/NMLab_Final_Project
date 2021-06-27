import React ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime,hexTostring} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'
import {stringToHex} from '../utils/utils'
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container" 

/*
    voting structure:
        deadline,
        title,
        content,
        goVoting
*/
function VotingList(){
    
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    
    const [Voting_list,setVoting_list] = useState([]);
    const [time,setTime] = useState(Date.now());
    const history = useHistory();
    useEffect(()=>{
        const timer = setTimeout(() => {
            setTime(Date.now());
          }, 1000);
    },[time])
    useEffect(()=>{
        const getList = async() =>{
            await getVoting_list();
        }
        getList();
    },[])
    // TODO:
    const getVoting_list=async() =>{
        // get voting infomation
        let _votingList = await contract.methods.getVotingList().call(); // contract: get the voteID
        var _list = [];
        for(var i = 0;i<_votingList.length;i+=1){
            //var _topic,_content,_duetime,_cands,_uplim = await contract.methods.getVote(1).call(); // contract: get the info of one voteID
            var _together = await contract.methods.getVote(_votingList[i]).call();
            var _topic = _together[0];
            var _content = _together[1];
            var _duetime = _together[2];
            var _cands = _together[3];
            var _numofvoters = _together[4];
            //console.log(_numofvoters);
            var _uplim = _together[5];
            var vote = {
                title: _topic,
                deadLine: Number(_duetime),
                voteID:_votingList[i]
                //voteID:0
            }
            _list = [..._list,vote];
            //console.log(typeof(_duetime));
            //console.log(_duetime);
        }
        _list.sort(function(a,b){
            return b.deadLine-a.deadLine;
        })
        setVoting_list(_list);
    }
    // TODO: identity checking: if he/she has the right to vote or time out
    const goVoting = async (voteItem) => {
        //console.log(voteItem.voteID);
        //console.log(uState.id)
        var hid = stringToHex(String(uState.id))
        // to the page to vote
        var isRight = await contract.methods.ifHeHasRight(voteItem.voteID,hid).call(); // to know if he/she has right to vote
        //console.log(isRight);
        if(!getTime(voteItem.deadLine)){
            alert("timeout")
            return
        }
        if (!isRight){
            alert("you can not vote this");
            return;
        }
        //My TODO: check if he voted already and timestamp
        var hasVoted = await contract.methods.checkVoted(voteItem.voteID,hid).call();
        if (hasVoted){
            alert("you already voted this");
            return;
        }
        var URL; 
        
        URL = '/Voting/'+voteItem.voteID;
        history.push(URL);
            // check is voted?
        
        
    }
    // 

    const renderVoting_list = Voting_list.map((voteItem,i)=>
        <Grid container justify="space-around" className="VotingListItem" onClick={()=>goVoting(voteItem)} key={i}>
            <Grid item className="VotingListItemTitle"><p>{voteItem.title}</p></Grid>
            <Grid item className="VotingListItemCountdown">{getTimeStr(voteItem.deadLine)}</Grid>
        </Grid>
    );
    
    function getTimeStr (deadLine) {
        var countDown = getTime(deadLine);
        if(countDown){
            countDown= `${countDown.dd} Days ${countDown.hr} Hr ${countDown.mm} Min ${countDown.ss} Sec Left`;
        }
        else{
            countDown = "Time Out!!!"
        }
        return countDown;
    }
    return (
        <Container maxWidth="lg" style={{padding:20}}>
        <Grid container direction="column" justify="space-around" alignItems="stretch" className="VotingList">
            {renderVoting_list}
        </Grid>
        </Container>
    );
}

export default VotingList;