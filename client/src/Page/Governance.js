import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import withRoot from "../withRoot";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import VoteModal from "../components/VoteModal";
import styles from "../css/Tap.module.css";
import NewPolicy from "../components/NewPolicy";
import Proposal from "../components/Proposal";
import StandByProposal from "../components/StandByProposal";
import CastVote from "../components/CastVote";
import VotingResult from "../components/VotingResult";
import Transactions from "./Transactions";
import JudgeObjection from "./JudgeObjection";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Governance({ token, userInfo }) {
  const [value, setValue] = React.useState(0);
  const [proposals, setProposals] = useState([]);
  const [updateNow, setUpdateNow] = useState(true);
  const [tryCount, setTryCount] = useState(0);
  const [standBy, setStandBy] = useState([]);
  const [activeVotes, setActiveVotes] = useState([]);
  const [voteResult, setVoteResult] = useState([]);
  const [tries, setTries] = useState([]);
  const [policies, setPolicy] = useState([]);

  // 제안 만료일 설정 (여기서는 1시간)
  const EXPIRED_PROPOSAL_TIME = 1 * 1 * 60 * 60 * 1000; // 단위 : 일 * 시간 * 분 * 초 * 밀리세컨
  // 제안이 통과되기 위한 정족수(%)
  const QUORUM = 50;
  // 제안이 통과되기 위한 최소 참여자 수
  const minParticipants = 3;

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const updateFunc = () => {
    setUpdateNow(!updateNow);
  };

  useEffect(() => {
    if (userInfo.account_type !== "worker") {
      window.alert("잘못된 접근입니다. 메인페이지로 이동합니다.");
      navigate("/");
    }
    // 현재 블록체인에서 진행중인 투표 읽어오기
    getActiveVotes();
    // 새로 신청된 Try가 있는지 확인
    getTryCount();
    // 진행중인 제안 읽어오기
    getProposals();
    // 1차 제안 투표에 통과하여 본 투표 직전에 대기하는 제안 불러오기
    getStandBy();
    // 모든 투표가 종료된 제안 불러오기
    getVoteResult();
  }, [updateNow]);

  // 블록체인에서 투표가 진행중인 vote의 자료를 DB에서 가져오기
  // (데몬이 실시간으로 트래킹하여 이미 DB에 저장했음)
  const getActiveVotes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/votes/getactivevotes",
        { headers: { authorization: token } }
      );
      setActiveVotes(res.data.data);
    } catch (err) {
      window.alert(
        "현재 Governance에서 진행중인 투표 목록을 불러오는데 실패했습니다."
      );
    }
  };

  // standBy 상태 proposal 데이터 요청
  const getStandBy = async () => {
    const res = await axios.get(
      "http://localhost:4000/proposals/getStandByProposals",
      { headers: { authorization: token } }
    );
    setStandBy(res.data.data);
  };

  // 데몬에서 종료된 투표 데이터를 읽어서 DB에 적재하면,
  // db에서 종료된 투표 데이터를 읽어오는 로직
  const getVoteResult = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/pastvotes/votesresult",
        { headers: { authorization: token } }
      );
      const policy = res.data.data.filter((item) => item.status === "8");
      setPolicy(policy);
      setVoteResult(res.data.data);
    } catch (err) {
      window.alert(
        "알 수 없는 원인으로 인하여 블록체인으로부터 투표 결과 데이터를 가져올 수 없습니다."
      );
    }
  };

  // DB에서 현재 up/down 진행중인 제안을 읽어옴
  // 제안을 읽어옴과 동시에 기간이 만료된 제안은 상태를 변경하고 상태변수에 넣지 않는다.
  // 제안에 대한 최소 참여자 수와 정족수를 만족한 제안은 상태변수에 넣지 않고, DB정보를 업데이트 한다.
  const getProposals = async () => {
    const res = await axios.get(
      "http://localhost:4000/proposals/getOnPostProposals",
      { headers: { authorization: token } }
    );
    console.log(res.data.data);
    const proposalsData = res.data.data;

    let filteredProposal = [];
    for await (const proposal of proposalsData) {
      const up = proposal.up;
      const down = proposal.down;
      const checkMinParticipants = up + down >= minParticipants;
      const checkQuorum = (100 * up) / (up + down) >= QUORUM;

      if (proposal.createdAt + EXPIRED_PROPOSAL_TIME >= new Date()) {

        await axios.patch(
          "http://localhost:4000/proposals/expiredProposal",
          proposal,
          { headers: { authorization: token } }
        );
        navigate("/ReRendering");
      } else if (checkMinParticipants && checkQuorum) {
        await axios.patch(
          "http://localhost:4000/proposals/successfulProposal",
          proposal,
          { headers: { authorization: token } }
        );
        navigate("/ReRendering");
      } else {
        filteredProposal.push(proposal);
      }
    }
    setProposals(filteredProposal);
  };

  const getTryCount = async () => {
    const res = await axios.get(
      `http://localhost:4000/tryagainst/getOnBoardTry`,
      { headers: { authorization: token } }
    );
    setTries(res.data.data)
    setTryCount(res.data.data.length);
  };

  const contractSetting = async () => {
    //
    // 테스트용 모더레이터 만드는 코드는 서버쪽에 있음
    //
    const res = await axios.post("http://localhost:4000/contractsetting");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Proposals" {...a11yProps(0)} />
          <Tab label="Passed Proposals" {...a11yProps(1)} />
          <Tab label={`Voting : ${activeVotes.length}`} {...a11yProps(2)} />
          <Tab label="Voting Result" {...a11yProps(3)} />
          <Tab label="Changed Policy" {...a11yProps(4)} />
          <Tab label="Transactions" {...a11yProps(5)} />
          {userInfo.mod_authority === true ? (
            <Tab label={`Court : ${tryCount}`} {...a11yProps(6)} />
          ) : (
            null
          )}
          {userInfo.worker_id === "admin01@gig.com" ? (
            <Tab label="Contract Setting" {...a11yProps(7)} />
          ) : null}
        </Tabs>
      </Box>

      {/*------------proposals------------*/}
      <TabPanel value={value} index={0}>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          <Grid item xs={6}></Grid>
          {/* 투표에 가기 전 전체적인 공감대를 얻을 수 있는지 확인하기 위하여 새로운 제안을 생성한다 */}
          <Grid item xs={1}>
            {userInfo.mod_authority === true ? (
              <Button variant="contained" size="small">
                <Link
                  style={{ color: "white" }}
                  component={RouterLink}
                  to="/createproposal"
                  state={{ token: token, userInfo: userInfo }}
                >
                  Create Proposal
                </Link>
              </Button>
            ) : (
              <Button variant="contained" disabled size="small">
                Create Proposal
              </Button>
            )}
          </Grid>

          {/* 어떤 제안을 올리기 전에 개발팀에게 기술적 범위에 대한 문의를 한다 */}
          <Grid item xs={2}>
            {userInfo.mod_authority === true ? (
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  navigate("/contactsupportteam", {
                    state: { token: token, userInfo: userInfo },
                  })
                }
              >
                Contact Support Team
              </Button>
            ) : (
              <Button variant="contained" disabled size="small">
                Contact Support Team
              </Button>
            )}
          </Grid>
        </Grid>
        {/*------------Proposal------------*/}
        <Grid>
          <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
            <div>
              <h3>Proposals</h3>
            </div>
            {proposals.map((proposal) => {
              return (
                <Proposal
                  key={proposal.proposal_id}
                  proposal={proposal}
                  token={token}
                  updateFunc={updateFunc}
                />
              );
            })}
          </div>
        </Grid>
      </TabPanel>

      {/*------------Passed Proposal------------*/}
      <TabPanel value={value} index={1}>
        <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
          <div>
            <h3>Stand By before Vote</h3>
          </div>
          {standBy.map((proposal) => {
            return (
              <StandByProposal
                key={proposal.proposal_id}
                proposal={proposal}
                token={token}
                updateFunc={updateFunc}
              />
            );
          })}
        </div>
      </TabPanel>

      {/*------------voting------------*/}
      <TabPanel value={value} index={2}>
        {/*------------voting in progress------------*/}
        <div style={{ padding: "10px" }}>
          <div className={styles.reviewBox}>
            <div>
              <h3>Cast Vote</h3>
            </div>
            <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
              {activeVotes.map((vote) => {
                return (
                  <li className={styles.taps} key={vote._id}>
                    <CastVote
                      vote={vote}
                      token={token}
                      userInfo={userInfo}
                      key={vote._id}
                    />
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </TabPanel>

      {/*------------voting result------------*/}
      <TabPanel value={value} index={3}>
        <div style={{ padding: "10px" }}>
          <div className={styles.reviewBox}>
            <div>
              <h3>Voting Result</h3>
            </div>
            <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
              {voteResult.map((vote) => {
                return (
                  <li className={styles.taps} key={vote._id}>
                    <VotingResult vote={vote} token={token} />
                  </li>
                );
              })}
            </div>
          </div>
        </div>
      </TabPanel>

      {/*------------changed policy------------*/}
      <TabPanel value={value} index={4}>
        <div style={{ padding: "10px" }}>
          <div>
            <h3>Recent Updated Policies</h3>
          </div>
          <li className={styles.taps}>
            {policies.length !== 0 ?
            (policies.map((policy) => (
              <NewPolicy policy={policy} token={token} />)))
            :null}
          </li>
        </div>
      </TabPanel>

      {/*------------transactions------------*/}
      <TabPanel value={value} index={5}>
        {/* 투표, 펜딩전환, 토큰전송 등으로 발생한 트랜잭션 정보를 검색한다. */}
        <Transactions></Transactions>
      </TabPanel>

      {/*------------court------------*/}

      <TabPanel value={value} index={6}>
        <JudgeObjection token={token} userInfo={userInfo} />
      </TabPanel>

      {/*------------contract setting------------*/}
      {/* admin@gig.com 전용 메뉴. 컨트랙트 주소를 재설정하거나, 수동 긱스코어 발송등을 한다. */}
      {userInfo.worker_id === "admin01@gig.com" ? (
        <TabPanel value={value} index={7}>
          <Grid item xs={2}>
            <Button variant="contained" size="small" onClick={contractSetting}>
              Contract Setting
            </Button>
          </Grid>
        </TabPanel>
      ) : null}
    </Box>
  );
}

export default withRoot(Governance);
