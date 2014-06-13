// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    type: String,
    email: String,
    favorite: Boolean,
    application: {
        firstName: String,
        middleName: String,
        lastName: String,
        email: String,
        address: {
            street: String,
            lineTwo: String,
            city: String,
            state: String,
            zipCode: Number,
            country: String
        },
        county: String,
        dateOfBirth: {
            day: Number,
            month: Number,
            year: Number
        },
        phone: {
            areaCode: Number,
            firstNumber: Number,
            secondNumber: Number
        },
        school: String,
        graduationDate: {
            day: Number,
            month: Number,
            year: Number
        },
        GPA: Number,
        essay: String
    }
});


// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
