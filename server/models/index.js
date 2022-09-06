const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: 'gigs',
        useNewUrlParser: true
    }, (error) => {
        if (error) {
            console.log("몽고DB 연결 실패");
        } else {
            console.log("몽고DB 연결 성공");
        }
    });
}

// mongo DB 커넥팅 이벤트리스너
// 접속에 이상이 있으면 에러를 출력하고,
// 네트워크 이상으로 접속이 끊어지면, 재접속을 시도함
mongoose.connection.on('error', (error) => {
    console.error('몽고DB 연결 에러 발생', error);
});
mongoose.connection.on('disconnected', () => {
    console.error('몽고DB 연결이 중단되어 연결 재시도');
    connect();
});

module.exports = connect;