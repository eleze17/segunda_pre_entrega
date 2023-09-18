import { Schema, model } from 'mongoose'
import mongoosePaginate  from 'mongoose-paginate-v2'

const messagesSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    postTime: {
        type: Date,
        default: Date.now
    }
})

messagesSchema.plugin(mongoosePaginate)
export const messageModel = model('messages', messagesSchema)