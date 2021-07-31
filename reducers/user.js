import users from '../users.json';
import events from '../events.json';
import eByUsers from '../eventByUser.json';

export const SET_USER_PROFILE = 'SET_USER_PROFILE'
export const SET_EVENT = 'SET_EVENT'
export const SET_ORGINEVENTS = 'SET_ORGINEVENTS'

export const setUserProfile = (userProfile) => ({
  type: SET_USER_PROFILE,
  payload: userProfile,
})

export const setNewEvent = (event) => ({
  type: SET_ORGINEVENTS,
  payload: event,
})

const initialEvents = (uid, shares) => {
  let result = []
  let data = eByUsers.eByUsers.filter(event => event.hostUid == uid);

  for(var i in data) {
    result.push(data[i]);
  }

  for(var i in shares) {
    data = eByUsers.eByUsers.filter(event => event.hostUid == shares[i].uid);
    if(data == '') continue;
    else {
      for(var i in data) {
        result.push(data[i]);
      }
    }
  }
  
  return result
}

// const initialShareEvents = (shares) => {
//   let result = []

//   for(var i in shares) {
//     let data = eByUsers.eByUsers.filter(event => event.hostUid == shares[i].uid);
//     if(data == '') continue;
//     else {
//       for(var i in data) {
//         result.push(data[i]);
//       }
//     }
//   }
  
//   return result
// }

const initialState = {
  userProfile: {
    email: users.users[0].email,
    name: users.users[0].name,
    uid: users.users[0].uid,
    color: users.users[0].color,
    shareUid: users.users[0].shareUid
  },
  event: initialEvents(users.users[0].uid, users.users[0].shareUid),
  originEvents: events,
  originEBU: eByUsers.eByUsers
  //shareEvent: initialShareEvents(users.users[0].shareUid)
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE: {
      return {
        ...state,
        userProfile: action.payload
      }
    }

    case SET_ORGINEVENTS:{
      return {
        ...state,
        event: action.payload,
      }
    }

    default:
      return {
        state,
        userProfile: {
          email: users.users[0].email,
          name: users.users[0].name,
          uid: users.users[0].uid,
          color: users.users[0].color,
          shareUid: users.users[0].shareUid
        },
        event: initialEvents(users.users[0].uid, users.users[0].shareUid),
        originEvents: events.events,
        originEBU: eByUsers.eByUsers
        //shareEvent: initialShareEvents(users.users[0].shareUid)
      }
  }
};

export default user;