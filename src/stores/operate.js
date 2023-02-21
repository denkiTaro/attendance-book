import { arrayRemove, arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';





const _docRef = Symbol();
class Data {
    /**
     * 
     * @param { 'data'|'week-data' } scope 
     */
    constructor( scope = 'week-data' ) {
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

    user = {
        /**
         * 
         * @param { String } user 
         */
        addUser: ( user ) => {
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
            updateDoc( this[_docRef], {
                'users': arrayRemove(user)
            } );
            console.log('removed user');
        },
        /**
         * 
         * @param { String } user 
         * @param { String } newUser 
         */
        nameChange: ( user, newUser ) => {
            this.onSnapshot( ( data )=>{

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
            const todayLocaleString = new Date().toLocaleString();
            const todayString = todayLocaleString.split(' ')[0];
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
         * の繰り返し
         * @param { String } user 
         * @param { String | '-' | '出席' | '欠席' } stateTxt 現在の状態
         */
        doubleClick: ( user, stateTxt ) => {
            if( stateTxt === '-' ) {
                console.log('no-setting');
                DataContext.attend.attendance(user);
            } else
            if( stateTxt === '出席' ) {
                console.log('出席');
                DataContext.attend.absent(user);
            } else
            if( stateTxt === '欠席' ) {
                console.log('欠席');
                DataContext.state.editStatus([user, 'コメント入力中...']);
            } else
            if( typeof stateTxt === 'string' ) {
                console.log('コメント');
                DataContext.state.editStatus([user,'']);
            }
        }
    }
}



const DataContext = new Data();
export default DataContext;


// new Int16Array( 100000000 ).forEach(()=>{console.log('test')})
