import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';



// 'state-data': {
//     '2000/1/1': {
//         'U1': '出席'
//     }
// }
// 'users': ['u1','u2']



/**
 * 今月分のデータをfirebase/<project>/dataに移す
 * lastUpdate を更新する
 * @param { Boolean } reset 今月分のデータは消える(移すので本質的にはデータは残る)
 */
function transferThisMonthData( reset ) {
    // 一週間分のデータをまとめてweek data から dataにセットする
    getDocs( collection( firestore, 'denki-club' ) )
    .then( (summaryDoc) => {
        // data, week data どちらも保持 = summaryDocs
        const newData = {};
        summaryDoc.forEach( (doc) => {
            // state-data, users を保持 = doc.data()
            newData[doc.id] = doc.data();
        } );
        // users作成 -> オブジェクトはmergeできるが配列はできないのでここで生成===============
        const integratedUsers = newData['data']['users'].concat( newData['month-data']['users'] );
        const siftedUsers = integratedUsers.filter( function(v,i,arr){ return arr.indexOf(v) === i } );
        // ================================================================================
        setDoc( doc( firestore, 'denki-club', 'data' ), {
            'state-data': newData['month-data']['state-data'],
            'users': siftedUsers,
        }, { merge: true } );

        if( reset === true ) {
            // week data initializeする
            setDoc( doc(firestore, 'denki-club', 'month-data'), {
                'state-data': {},
                'users': [],
            } );
        }
    } )
    .then( ()=> {
        const thisMonth = new Date().getMonth() + 1;
        setDoc( doc(firestore, 'denki-club', 'data'), {
            'lastUpdate': thisMonth,
        } );
    } );
}



const _docRef = Symbol();
class Operate {
    /**
     * 
     * @param { 'data'|'month-data' } scope 
     */
    constructor( scope = 'month-data' ) {
        this[_docRef] = doc( firestore, 'denki-club', scope );
    }

    /**
     * 
     * @param { ({ 'state-data': Object, 'users': Array })=>void } func 引数にデータが入る
     */
    onSnapshot( func ) {
        onSnapshot(
            this[_docRef],
            (data)=>{
                func(data.data());
                console.log('did onSnapshot');
            }
        )
    }

    /**
     * 今月更新がされていないことを確認してtransferThisMonthData()を実行する
     */
    checkAndUpdate() {
        getDoc( doc(firestore, 'denki-club', 'data') )
        .then( (e) => {
            if(e.data()['lastUpdate'] !== new Date().getMonth() + 1 ) {
                transferThisMonthData(true);
            }
        } )
    }

    mode = {
        /**
         * 
         * @param { 'data'|'month-data' } scope 
         */
        changeMode: ( scope ) => {
            this[_docRef] = doc( firestore, 'denki-club', scope );
        }
    }

    user = {
        /**
         * 
         * @param { String } user 
         */
        addUser: ( user ) => {
            if( user === '' )return;
            updateDoc( this[_docRef], {
                'users': arrayUnion(user)
            } );
            console.log('added user');
        },
        /**
         * 
         * @param { String } user 
        */
        removeUser: ( user ) => {
            if( user === '' )return;
            updateDoc( this[_docRef], {
                'users': arrayRemove(user)
            } );
            const entriesData = [];
            getDoc(this[_docRef])
            .then( (data)=> {
                Object.entries(data.data()['state-data']).forEach( (e)=> {
                    const day = e[0];
                    const userAndStatusObj = e[1];
                    delete userAndStatusObj[user];
                    entriesData.push( [day, userAndStatusObj] );
                } );
                const upData = Object.fromEntries(entriesData);
                updateDoc( this[_docRef], {
                    'state-data': upData
                } );
            } );
            console.log('removed user');
        },
        /**
         * 
         * @param { String } user 
         * @param { String } newUser 
         */
        changeName: ( user='', newUser='' ) => {
            if( newUser === '' || user === '' )return;
            updateDoc( this[_docRef], {
                'users': arrayRemove(user),
            } );
            updateDoc( this[_docRef], {
                'users': arrayUnion(newUser),
            } );

            getDoc(this[_docRef])
            .then( (data)=> {
                const entriesData = [];
                Object.entries(data.data()['state-data']).forEach( (e)=> {
                    const day = e[0];
                    const userAndStatusObj = e[1];
                    if( user in userAndStatusObj ) {
                        userAndStatusObj[newUser] = userAndStatusObj[user];
                        delete userAndStatusObj[user];
                        entriesData.push( [day, userAndStatusObj ] );
                    } else {
                        entriesData.push( [day,userAndStatusObj] );
                    }
                } );
                const upData = Object.fromEntries(entriesData);
                updateDoc( this[_docRef], {
                    'state-data': upData
                }
                )
            } )
        } 
    }


    state = {
        /**
         * 今日の分のテーブルがなかった場合追加する
         */
        addToday: () => {
            const todayLocaleString = new Date().toLocaleString();
            const todayString = todayLocaleString.split(' ')[0];
            this.onSnapshot(
                (data)=>{
                    const i = Object.keys(data['state-data']).indexOf(todayString);
                    if( i===-1 ) {

                        const newStateData = data['state-data'];
                        newStateData[todayString] = {};
                        updateDoc( this[_docRef], {
                            'state-data': newStateData
                        } )

                        console.log('added today');
                    }
                }
            );
        },
        /**
         * 今日の状況を設定する
         * @param {...[User<String>, State<true|false|String>]} userAndStatus Stateはtrue->出席 false->欠席 String->コメント
         */
        editStatus: ( ...userAndStatus ) => {
            const todayString = new Date().toLocaleString().split(' ')[0];
            const [users, userStatus] = [ [],[] ];
            userAndStatus.forEach( (e)=> {
                users.push(e[0]);
                userStatus.push(e[1]);
            } );

            getDoc(this[_docRef]).then( (data)=> {
                const newStateData = data.data()['state-data'];
                users.forEach( (user, i)=> {newStateData[todayString][user] = userStatus[i];} );
                updateDoc( this[_docRef], {
                    'state-data': newStateData
                } );
            } )
        }
    }

    attend = {
        /**
         * 出席する
         * @param { String } user 
         */
        attendance: ( user ) => {
            this.state.editStatus( [user,'出席'] );
        },
        /**
         * 欠席する
         * @param { String } user 
         */
        absent: ( user ) => {
            this.state.editStatus( [user,'欠席'] );
        }
    }

    toggle = {
        /**
         * 一回目 出席
         * 二回目 欠席
         * 三回目 コメント
         * 四回目 初期値
         * の繰り返し
         * @param { String } user 
         * @param { String | '-' | '出席' | '欠席' } stateTxt 現在の状態
         */
        doubleClick: ( user, stateTxt ) => {
            if( stateTxt === '-' ) {
                this.attend.attendance(user);
            } else
            if( stateTxt === '出席' ) {
                this.attend.absent(user);
            } else
            if( stateTxt === '欠席' ) {
                this.state.editStatus([user, '-']);
            } else
            if( typeof stateTxt === 'string' ) {
                this.state.editStatus([user, '-']);
            }
        }
    }
}


export default Operate;
export {transferThisMonthData};
