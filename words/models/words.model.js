const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    word: String,
    explained: String,
    userId: String
});

wordSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
wordSchema.set('toJSON', {
    virtuals: true
});

wordSchema.findById = function (cb) {
    return this.model('Words').find({id: this.id}, cb);
};

wordSchema.findByUserId = function (cb) {
    return this.model('Words').find({userId: this.userId}, cb);
};

const Word = mongoose.model('Words', wordSchema);

exports.createWord = (wordData) => {
    const word = new Word(wordData);
    return word.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Word.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, words) {
                if (err) {
                    reject(err);
                } else {
                    resolve(words);
                }
            })
    });
};

exports.findByUserId = (id) => {
    return new Promise((resolve, reject) => { 
        Word.find({ userId: id })
            .exec(function (err, words) {
            if (err) {
                reject(err);
            } else {
                resolve(words);
            }
        })
    });
};