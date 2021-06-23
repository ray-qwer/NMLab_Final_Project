import react ,{useState,Component,useEffect,useContext} from 'react'
import  "../App.css"
import {useHistory} from 'react-router-dom' 
import {getTime} from '../utils/utils'
import {UserContext} from '../utils/ReducerContext'
import Grid from "@material-ui/core/Grid"

function ResultList(){
    // for Testing, can delete them, be careful that at useState also need to reclaim them 
    const myFirstVote = {
        deadLine: new Date("2021/6/8 21:00:00"),
        title: "1st Vote",
        voteID: 1
    };
    const mySecVote = {
        deadLine: new Date("2021/6/4 11:20:00"),
        title: "2nd Vote",
        voteID: 2
    };
    // end testing
    const {uState,uDispatch,accounts,web3,contract} = useContext(UserContext);
    const [Result_list,setResult_list] = useState([myFirstVote,mySecVote]);
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
        // get voting infomation
        // @pei-an you just put how you get _list here
        var _votingList = await contract.methods.getVotingList(); // contract: get the voteID
        // var _list = [];
        // for(var i = 0;i<_votingList.length;i+=1){
        //     var [_topic,_content,_duetime,_,_] = await contract.methods.getVoteinfo(_votingList[i]); // contract: get the info of one voteID
        //     // new !! convert hex to string
        //     // 
        //     var vote = {
        //         title: _topic,
        //         deadLine:_duetime,
        //         voteID:_votingList[i]
        //     }
        //     _list = [..._list,vote];
        // }
        var rList = [];
        for (var i =0;i<_list.length;i+=1){
            if (_list[i].deadLine < Date.now()){
                rList = [...rList,_list[i]]
            }
        }
        setVoting_list(_rList);
    }
    const goResult = (resultItem) => {
        var URL='/Result/'+resultItem.voteID;
        history.push(URL);
    }
    const getDay = (a) =>{
        const deadLine = new Date(a);
        const year = deadLine.getFullYear();
        const month = deadLine.getMonth();
        const day = deadLine.getDay();
        const hours = deadLine.getHours();
        const minutes = (deadLine.getMinutes()/10 < 1)?'0'+deadLine.getMinutes():deadLine.getMinutes();
        const seconds = (deadLine.getSeconds()/10 < 1)?'0'+deadLine.getSeconds():deadLine.getSeconds();
        return year+'/'+month+'/'+day+' '+hours+':'+minutes+':'+seconds
    }
    const renderResult_list = Result_list.map((ResultItem,i)=>
        
            <Grid container justify="space-around" className="VotingListItem" onClick={()=>goResult(ResultItem)}  key={i}>
                <Grid item className="VotingListItemTitle"><p>{ResultItem.title}</p></Grid>
                <Grid item className="VotingListItemCountdown">Due at: {getDay(ResultItem.deadLine)}</Grid>
            </Grid>
        
    );
    return (
        <Grid container direction="column" justify="space-around" alignItems="stretch" className="ResultList">
            {renderResult_list}
        </Grid>
    );
}

export default ResultList;