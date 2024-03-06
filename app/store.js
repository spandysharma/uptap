import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import cardsReducer from './cardsSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        cards: cardsReducer
    }
})
