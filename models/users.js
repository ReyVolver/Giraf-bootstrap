var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    ClassSchema = require('./classes'),
    PromotionSchema = require('./promotions'),
    FileSchema = require('./files');

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstname: {
        type: String,
        require: true,
        trim: true
    },
    lastname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        require: true,
        trim: true
    },
    photo_path: String,
    role: Number,
    hashed_password: String,
    salt: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('firstname').validate(function(firstname) {
    return (typeof firstname === 'string' && firstname.length > 0);
}, 'Firstname cannot be blank');

UserSchema.path('lastname').validate(function(lastname) {
    return (typeof lastname === 'string' && lastname.length > 0);
}, 'Lastname cannot be blank');

UserSchema.path('email').validate(function(email) {
    return (typeof email === 'string' && email.length > 0);
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function(hashed_password) {
    return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew){
        this.updated_at = Date.now();
        return next();
    }

    if (!validatePresenceOf(this.password))
        next(new Error('Invalid password'));
    else{
        this.role = 0; //0 = student - 1 = professor
        this.updated_at = this.created_at = Date.now();
        next();
    }
});

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

mongoose.model('User', UserSchema);