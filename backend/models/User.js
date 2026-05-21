import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MorningMotivation from "../../frontend/src/components/MorningMotivation";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avtar: {
        type: String,
        default: false
    },
    MorningMotivation: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.toJSON = function (){
    const obj = this.toObject();
    delete obj.password;
    return obj;
}


export default mongoose.model("User",userSchema);