import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"

function ResultList(){
    // for Testing, can delete them, be careful that at useState also need to reclaim them 
    /*const myFirstVote = {
        deadLine: "2021/6/8 21:00:00",
        title: "1st Vote",
        voteID: 1
    };
    const mySecVote = {
        deadLine: "2021/6/4 11:20:00",
        title: "2nd Vote",
        voteID: 2
    };*/
    // end testing
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const [Result_list,setResult_list] = useState([]);
    const [time,setTime] = useState(Date.now())
    const history = useHistory();
    useEffect(()=>{
        const timer = setTimeout(() => {
            setTime(Date.now());
          }, 1000);
    },[time])
    useEffect (()=>{
        const getList = async() =>{
            await getResult_list();
        }
        getList();
    },[])
    const getResult_list = async() => {
        // get result list
        // getTime(deadline) == false if time out  // def in utils/utils.js
        //new
        var _votingList = await contract.methods.getVotingList().call();
        var _list = [];
        for(var i = 0;i<_votingList.length;i+=1){
             var _together = await contract.methods.getVote(_votingList[i]).call(); // contract: get the info of one voteID
             var _topic = _together[0];
             var _content = _together[1];
             var _duetime = _together[2];
             var _cands = _together[3];
             var _numofvoters = _together[4];
             var _uplim = _together[5];       
       
             var vote = {
                 title: _topic,
                 deadLine:Number(_duetime),
                 voteID:_votingList[i]
             }
             _list = [..._list,vote];
         }
        var rList = [];
        for (var i =0;i<_list.length;i+=1){
            console.log(_list[i].deadLine)
            console.log(typeof(_list[i].deadLine))
            if (_list[i].deadLine < Date.now()){
                rList = [...rList,_list[i]]
            }
        }
        rList.sort(function(a,b){
            return a.deadLine-b.deadLine;
        })
        setResult_list(rList);
        //console.log(rList);
    }
    const goResult = (resultItem) => {
        var URL='/Result/'+resultItem.voteID;
        history.push(URL);
    }
    const getDay = (a) =>{
        const deadLine = new Date(a);
        const year = deadLine.getFullYear();
        const month = deadLine.getMonth()+1;
        const day = deadLine.getDate();
        const hours = (deadLine.getHours()/10 < 1)?'0'+deadLine.getHours().toString():deadLine.getHours();;
        const minutes = (deadLine.getMinutes()/10 < 1)?'0'+deadLine.getMinutes().toString():deadLine.getMinutes();
        const seconds = (deadLine.getSeconds()/10 < 1)?'0'+deadLine.getSeconds().toString():deadLine.getSeconds();
        return year+'/'+month+'/'+day+' '+hours+':'+minutes+':'+seconds
    }
    const renderResult_list = Result_list.map((ResultItem,i)=>
        
        <Grid container justify="space-around" className="VotingListItem" onClick={()=>goResult(ResultItem)}  key={i}>
            <Grid item className="VotingListItemTitle"><p>{ResultItem.title}</p></Grid>
            <Grid item className="VotingListItemCountdown">Due at: {getDay(ResultItem.deadLine)}</Grid>
        </Grid>

        
    );
    return (
        <Container maxWidth="lg" style={{padding:20}}>
        <Grid container direction="column" justify="space-around" alignItems="stretch" className="ResultList">
            {renderResult_list}
        </Grid>
        </Container>
    );
}

export default ResultList;