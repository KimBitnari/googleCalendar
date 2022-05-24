import users from '../users.json';
import events from '../events.json';
import eByUsers from '../eventByUser.json';

export const SET_USER_PROFILE = 'SET_USER_PROFILE'
export const SET_EVENT = 'SET_EVENT'
export const SET_ORGINEVENTS = 'SET_ORGINEVENTS'
export const SET_ORGINEVENTSBYUSER = 'SET_ORGINEVENTSBYUSER'

export const setUserProfile = (userProfile) => ({
  type: SET_USER_PROFILE,
  payload: userProfile,
})

export const setEvent = (event) => ({
  type: SET_EVENT,
  payload: event,
})

export const setNewEvent = (originEvents) => ({
  type: SET_ORGINEVENTS,
  payload: originEvents,
})

export const setNewEventByUser = (originEBU) => ({
  type: SET_ORGINEVENTSBYUSER,
  payload: originEBU,
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

const initialState = {
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
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_PROFILE: {
      return {
        ...state,
        userProfile: action.payload
      }
    }

    case SET_EVENT:{
      return {
        ...state,
        event: action.payload,
      }
    }

    case SET_ORGINEVENTS:{
      return {
        ...state,
        originEvents: action.payload,
      }
    }

    case SET_ORGINEVENTSBYUSER:{
      return {
        ...state,
        originEBU: action.payload,
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
      }
  }
};

export default user;