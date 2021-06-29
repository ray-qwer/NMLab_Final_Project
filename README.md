# NMLab Final Project Group 8- Blockchain Voting
 
## things need to install
1. yarn
    install by npm:
    ```
    > npm install -g yarn
    ```
2. ganache
5. truffle
    ```
    > npm install -g truffle
    ```
7. metamask
    it's a chrome plugin

## get start
1. at your terminal
    ```
    > git clone https://github.com/ray-qwer/NMLab_Final_Project.git
    > cd NMLab_Final_Project
    ```
2. start ganache on your PC

3. at your terminal
    ```
    > truffle compile
    > truffle migrate
    ```
4. replace ./src/build by ./build
5. at your terminal
    ```
    > yarn
    > yarn start
    ```
the main page would be like below, with id is customer by default at the top right 
![](https://i.imgur.com/lB2lnqC.jpg)

## main feature
There are two modes: manager mode and user mode
manager mode is set at the address migrating the contract
- **manager mode**: create vote, vote for others, see results, change ID
- **user mode**: vote for others, see results, change ID

- create vote
    - add the topic, content, etc. about the vote
    - can do multi-ballot vote, upperlimit is the number of candidates
    - add voters: give right to voters, keyin by ID
    ![](https://i.imgur.com/VJa80T6.jpg)

- voting list
    - list of all votes, ordered by due time
    - show the topic and countdown about the vote
    - choose one to click, if you have right, time isn't timeout, and never vote for this vote, page will route to another view. 
    ![](https://i.imgur.com/JzSNWTb.jpg)
    ![](https://i.imgur.com/FWomG2r.jpg)


- voting
    - choose your options, and summit. Here will need to do a recheck.
    ![](https://i.imgur.com/ueGrXoW.jpg)
    - if you violate the rules, eg. vote over the upperlimit, will pop up a message box to warn.
    ![](https://i.imgur.com/c57bBpf.jpg)

- result list:
    - shows all votes that is end up
    - all people can access each one
    ![](https://i.imgur.com/0vxfguw.jpg)

- result page
    - a table about the result
    - can order by votes he/her get, number.
    ![](https://i.imgur.com/1fd8BxA.jpg)

- change ID
    - if you are customer and want to vote, please set ID with no space first
    ![](https://i.imgur.com/DAW9njk.png)
    - can check if someone used this ID by click "verify"
    ![](https://i.imgur.com/yt0x6PD.png)

## conclusion
我們以Dapp連結區塊鏈打造了簡單版的投票系統，大部分功能皆已齊全，而資訊加密的部分因時間及難度問題目前沒有呈現在上面，希望之後可以進行整合，完成更完整的區塊鏈投票。
當中雖然還有許多問題，像是ID該由選舉主辦方去做分發、如何增加/砍掉manager等等安全性的問題，需要更多的討論來實踐。
