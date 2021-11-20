// import { Register, UserDetails } from './functions/StoreFunctions';
import { RecognitionMode } from './interfaces/recognitionModeEnum';
import { IAction } from './interfaces/storeInterfaces';

const initialState = {
  recognitionMode:RecognitionMode.Recording,
}

const changeState = (state = initialState, { type, payload }:any) => {
  console.log(`from store`, payload);
  switch (type) {
    case 'RECOGNITION_MODE':
      return { ...state, recognitionMode: parseInt(payload) }

    default:
      return state
  }
}

export default changeState;